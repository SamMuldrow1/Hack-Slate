
var appe = require('express')();
var http = require('http').Server(appe);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var PythonShell = require('python-shell');
r = require('rethinkdb');
var generate = require('project-name-generator');
const fs = require('fs');















appe.get('/', function(req, res){
  res.sendFile(__dirname + '/index_login.html');
});
appe.get('/Main.html', function(req, res){
  res.sendFile(__dirname + '/Main.html');
});
appe.get('/style_index_scratch.css', function(req, res){
  res.sendFile(__dirname + '/css/style_index_scratch.css');
});
appe.get('/index_scratchpad.html', function(req, res){
  res.sendFile(__dirname + '/index_scratchpad.html');
});
appe.get('/TestImg.png', function(req, res){
  res.sendFile(__dirname + '/TestImg.png');
});
appe.get('/InfoPage.html', function(req, res){
  res.sendFile(__dirname + '/InfoPage.html');
});
appe.get('/css/Style.css', function(req, res){
  res.sendFile(__dirname + '/css/Style.css');
});
appe.get('/js/index.js', function(req, res){
  res.sendFile(__dirname + '/js/index.js');
});
appe.get('/css/Style.css', function(req, res){
  res.sendFile(__dirname + '/css/Style.css');
});



appe.get('/a.txt', function(req, res){
  res.sendFile(__dirname + '/a.txt');
});
appe.get('/c.txt', function(req, res){
  res.sendFile(__dirname + '/c.txt');
});

io.on('connection', function(socket){
	
	io.to(socket.id).emit('SendID', socket.id);
	console.log("a user has connected");
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
	console.log(msg);
  });
  
  socket.on('FileChange', function(FileArray){
    io.emit('FileChange', FileArray);
	console.log(FileArray);
  });
  
  
  var connection = null;
  const saltRounds = 10;
  var bcrypt = require("bcryptjs");
  var aes256 = require('aes256');
  	function InsertUser(Username, PassWord, email, SocketID){


	var fs = require('fs');  
	fs.readFile('./cacert', function(err, caCert) {  
	  r.connect({
	    host: 'aws-us-east-1-portal.5.dblayer.com',
	    port:24068,
	    authKey: '21536e12747fad0cd8c9f844577ee9db',
	    ssl: {
	      ca: caCert
	    }
	  }, function(error, conn) {
	    
	  
			
		
			if (err) throw err; 
			connection = conn;
			r.db("test").table("users").filter({UserName: Username}).count().eq(1).run(conn,function (err, data) {
					console.log(data);
					if( data == true){
						io.to(SocketID).emit('UserExists', '');
						
				}else{
					r.db("test").table("users").filter({Email: email}).count().eq(1).run(conn,function (err, data) {
					console.log(data);
					if(data == true){
						io.to(SocketID).emit('EmailExists', '');
						
					}else{
					
					
					bcrypt.hash(PassWord, 8, function(err, hash) {

		   
						
						r.table('users').insert([
							{ UserName: Username, Password: hash, Email: email,
							  	Projects: [{

							  }]
							}
						]).run(connection, function(err, result) {
							if (err) throw err;
								console.log(JSON.stringify(result, null, 2));
								
						})
					});	
					}
					})
				}
			})
			

		 })
	  });
	}




 
fs.readFile('./cacert', function(err, caCert) {  
  r.connect({
    host: 'aws-us-east-1-portal.5.dblayer.com',
    port:24068,
    authKey: '21536e12747fad0cd8c9f844577ee9db',
    ssl: {
      ca: caCert
    }
  }, function(error, conn) {	
	
    if (err) throw err;
    connection = conn;
    r.table('users').changes().run(connection, function(err, cursor) {
	  cursor.each(console.log);
	})
	function CreateTable(database, name){
			r.db(database).tableCreate(name).run(connection, function(err, result) {
			if (err) throw err;
			console.log(JSON.stringify(result, null, 2));
		})
	}


	function GetUserProjects(UserName, SocketID){
		
		
		
		r.table('users').filter(r.row('UserName').eq(UserName)).getField('Projects').run(connection, function(err, cursor) {
			if (err) throw err;
			
				cursor.toArray(function(err, result) {
				if (err) throw err;
					x = JSON.stringify(result, null, 2);
					console.log(x);
				    r.table('users').filter(r.row('UserName').eq(UserName)).run(connection, function(err, cursor) {
						if (err) throw err;
						
							cursor.toArray(function(err, result) {
							if (err) throw err;
								y = JSON.stringify(result, null, 2);
								io.to(SocketID).emit('GetProjects', x, y);


						});
						
					});

						

			});
			
		});
		
		
	}

	function AddProject(UserName, SocketID, NewProject){
		NewProject = { 
			
			ProjectName: {
		      Issues: [],
		      Doing: [],
		      Done: []
		    }

		    

		}

		
		r.table('users').filter(r.row("UserName").eq(UserName)).update(
		   {Projects:  r.row("Projects").append(NewProject)}
		).run(connection, function(err, result) {
	        if (err) throw err;
	        console.log(JSON.stringify(result, null, 2));
	    });



		
	}

	function AddIssue(UserName, SocketID, ProjectName, NewIssue, Category, IsSwitch, PastNumber){
		

		console.log("IsSwitch is equal to: "+IsSwitch);
		switch(Category) {
		    case 0:
		    	console.log("logging issue");
		    		r.table('users').filter(r.row('UserName').eq(UserName)).getField('Projects').run(connection, function(err, cursor) {
						if (err) throw err;
						
							cursor.toArray(function(err, result) {
							if (err) throw err;
								x = JSON.stringify(result, null, 2);
									
								ProjectObject = JSON.parse(x);
								if(ProjectObject[0].ProjectName.Issues.length == null){

										NewIssue.NumberVar = 0;

								}else{

									NewIssue.NumberVar = ProjectObject[0].ProjectName.Issues.length;

								}
								
						        console.log(NewIssue.NumberVar);
						        r.table('users').filter(r.row("UserName").eq(UserName)).update(
								   {Projects: {ProjectName: {Issues: r.row("Projects")("ProjectName")("Issues").default([]).append(NewIssue)}}}
								).run(connection, function(err, result) {
							        if (err) throw err;
							        console.log("Database has been written to!")
							    });
								console.log(IsSwitch);
							    if(IsSwitch != null){
							    	switch(parseInt(IsSwitch)) {
									    case 0:
									        console.log("Executing Code Block 0");
									        DeleteIssue(UserName, SocketID, ProjectName, PastNumber , IsSwitch );
									        break;
									    case 1:
									        console.log("Executing Code Block 1");
									        DeleteIssue(UserName, SocketID, ProjectName,  PastNumber , IsSwitch );
									        break;
									    case 2:
									        console.log("Executing Code Block 2");
									        DeleteIssue(UserName, SocketID, ProjectName, PastNumber, IsSwitch );
									        break
									}
							    	

							    }



						});
						
					});
		    

			    
			      
			    

		        break;
		    case 1:
		    		r.table('users').filter(r.row('UserName').eq(UserName)).getField('Projects').run(connection, function(err, cursor) {
						if (err) throw err;
						
							cursor.toArray(function(err, result) {
							if (err) throw err;
								x = JSON.stringify(result, null, 2);
								console.log(x);	
								ProjectObject = JSON.parse(x);
								if(ProjectObject[0].ProjectName.Doing.length == null){

										NewIssue.NumberVar = 0;

								}else{

									NewIssue.NumberVar = ProjectObject[0].ProjectName.Doing.length;
									
								}
								
						        console.log(NewIssue.NumberVar);
						        r.table('users').filter(r.row("UserName").eq(UserName)).update(
								   {Projects: {ProjectName: {Doing: r.row("Projects")("ProjectName")("Doing").default([]).append(NewIssue)}}}
								).run(connection, function(err, result) {
							        if (err) throw err;
							        

							    });
								console.log(IsSwitch);
							    if(IsSwitch != null){
							    	switch(parseInt(IsSwitch)) {
									    case 0:
									        console.log("Executing Code Block 0");
									        DeleteIssue(UserName, SocketID, ProjectName, PastNumber , IsSwitch );
									        break;
									    case 1:
									        console.log("Executing Code Block 1");
									        DeleteIssue(UserName, SocketID, ProjectName,  PastNumber , IsSwitch );
									        break;
									    case 2:
									        console.log("Executing Code Block 2");
									        DeleteIssue(UserName, SocketID, ProjectName, PastNumber, IsSwitch );
									        break
									}
							    	

							    }


						});
						
					});		    
		    

		        
		        break;
		    case 2:
		    		r.table('users').filter(r.row('UserName').eq(UserName)).getField('Projects').run(connection, function(err, cursor) {
						if (err) throw err;
						
							cursor.toArray(function(err, result) {
							if (err) throw err;
								x = JSON.stringify(result, null, 2);
								console.log(x);	
								ProjectObject = JSON.parse(x);
								if(ProjectObject[0].ProjectName.Done.length == null){

										NewIssue.NumberVar = 0;

								}else{

									NewIssue.NumberVar = ProjectObject[0].ProjectName.Done.length;
									
								}
								
								
						        console.log(NewIssue.NumberVar);
						        r.table('users').filter(r.row("UserName").eq(UserName)).update(
								   {Projects: {ProjectName: {Done: r.row("Projects")("ProjectName")("Done").default([]).append(NewIssue)}}}
								).run(connection, function(err, result) {
							        if (err) throw err;
							     //   console.log(JSON.stringify(result, null, 2));
							    });	
								console.log(IsSwitch);
							    if(IsSwitch != null){
							    	switch(parseInt(IsSwitch)) {
									    case 0:
									        console.log("Executing Code Block 0");
									        DeleteIssue(UserName, SocketID, ProjectName, PastNumber , IsSwitch );
									        break;
									    case 1:
									        console.log("Executing Code Block 1");
									        DeleteIssue(UserName, SocketID, ProjectName,  PastNumber , IsSwitch );
									        break;
									    case 2:
									        console.log("Executing Code Block 2");
									        DeleteIssue(UserName, SocketID, ProjectName, PastNumber, IsSwitch );
									        break
									}
							    	

							    }



						});
						
					});		
		        break;
		    case 3:

		    	DeleteIssue(UserName, SocketID, ProjectName, PastNumber, IsSwitch );
		    	console.log("Deleting an issue");
		    	break;		       	

		}








		
	}
	function AddDoing(UserName, SocketID, ProjectName, NewIssue ){
		
		var This3 = "5";
		var NewIssue = {
				Title: "Example Issue",
	            Due: "Due date",
	            NumberVar: 0,
	            Task: "Example Task",
	            Type: "",
	            Users: [""]


		};

		console.log("Adding a Doing" + UserName);
		

	    r.table('users').filter(r.row("UserName").eq(UserName)).update(
		   {Projects: {ProjectName: {Issues: r.row("Projects")("ProjectName")("Issues").default([]).append(NewIssue)}}}
		).run(connection, function(err, result) {
	        if (err) throw err;
	       
	    });
	   	r.table('users').filter(r.row("UserName").eq(UserName)).update(
		   {Projects: {ProjectName: {Doing: r.row("Projects")("ProjectName")("Doing").default([]).append(NewIssue)}}}
		).run(connection, function(err, result) {
	        if (err) throw err;
	       
	    });
	    r.table('users').filter(r.row("UserName").eq(UserName)).update(
		   {Projects: {ProjectName: {Done: r.row("Projects")("ProjectName")("Done").default([]).append(NewIssue)}}}
		).run(connection, function(err, result) {
	        if (err) throw err;
	       
	    });

		



		
	}

	function DeleteIssue(UserName, SocketID, ProjectName, NumberVar, Category ){
		


		console.log("Deleting An Issue NumberVar: "+ parseInt(NumberVar) +" At Category: "+ Category);
		
			
		
		NumberVar = parseInt(NumberVar);
		
		switch(parseInt(Category)) {
		    case 0:
				r.table('users').filter(r.row('UserName').eq(UserName)).getField('Projects').run(connection, function(err, cursor) {
					if (err) throw err;
					
						cursor.toArray(function(err, result) {
						if (err) throw err;
							x = JSON.stringify(result, null, 2);
							ProjectObject = JSON.parse(x);
							for (i = 0; i < ProjectObject[0].ProjectName.Issues.length; i++) { 
									if(ProjectObject[0].ProjectName.Issues[i].NumberVar == NumberVar){
								        r.table('users').filter(r.row("UserName").eq(UserName)).update(
										   {Projects: {ProjectName: {Issues: r.row("Projects")("ProjectName")("Issues").deleteAt(i)}}}
										).run(connection, function(err, result) {
									        if (err) throw err;
									        
									    });



										}

							              
							          }

					});
					
				});

		        break;
		    case 1:
				r.table('users').filter(r.row('UserName').eq(UserName)).getField('Projects').run(connection, function(err, cursor) {
					if (err) throw err;
					
						cursor.toArray(function(err, result) {
						if (err) throw err;
							x = JSON.stringify(result, null, 2);
							ProjectObject = JSON.parse(x);
							for (i = 0; i < ProjectObject[0].ProjectName.Doing.length; i++) { 
									if(ProjectObject[0].ProjectName.Doing[i].NumberVar == NumberVar){
								        r.table('users').filter(r.row("UserName").eq(UserName)).update(
										   {Projects: {ProjectName: {Doing: r.row("Projects")("ProjectName")("Doing").deleteAt(i)}}}
										).run(connection, function(err, result) {
									        if (err) throw err;
									        
									    });



										}

							              
							          }

					});
					
				});
		        break;
		    case 2:
				r.table('users').filter(r.row('UserName').eq(UserName)).getField('Projects').run(connection, function(err, cursor) {
					if (err) throw err;
					
						cursor.toArray(function(err, result) {
						if (err) throw err;
							x = JSON.stringify(result, null, 2);
							ProjectObject = JSON.parse(x);
							for (i = 0; i < ProjectObject[0].ProjectName.Done.length; i++) { 
									if(ProjectObject[0].ProjectName.Done[i].NumberVar == NumberVar){
								        r.table('users').filter(r.row("UserName").eq(UserName)).update(
										   {Projects: {ProjectName: {Done: r.row("Projects")("ProjectName")("Done").deleteAt(i)}}}
										).run(connection, function(err, result) {
									        if (err) throw err;
									        
									    });



										}

							              
							          }

					});
					
				});
			    break;
		}

	
		
	}


	function AddCurrentIssue(UserName, SocketID, ProjectName, Issue){
		console.log("AddCurrentIssue");
		r.table('users').filter(r.row("UserName").eq(UserName)).update(
		   {CurrentIssue:  Issue}
		).run(connection, function(err, result) {
	        if (err) throw err;
	        console.log(JSON.stringify(result, null, 2));
	    });





	}

	function FeedUpdate(UserName, SocketID, Desc, datetime){
		console.log(Desc);
		var NewFeed ={
			Title: Desc.Title,
			Task: Desc.Task,
			FeedDate: datetime,

		}

		r.table('users').filter(r.row("UserName").eq(UserName)).update(
		   {Feed:  r.row("Feed").default([]).append(NewFeed)}
		).run(connection, function(err, result) {
	        if (err) throw err;
	        console.log(JSON.stringify(result, null, 2));
	    });
	}

	function CreateNewType(UserName, ID, Type){
		var StringType = Type.Type;
		
		var NewType ={
			Type: Type.Type,
			

		};
		/*
		r.table('users').filter(r.row('UserName').eq(UserName)).update({
		    Type: r.row('Type').deleteAt(0)
		}).run(conn, function(err, result) {
	        if (err) throw err;
	        console.log(JSON.stringify(result, null, 2));
	    });
			*/
		r.table('users').filter(r.row('UserName').eq(UserName)).run(connection, function(err, cursor) {
						if (err) throw err;
						
							cursor.toArray(function(err, result) {
							if (err) throw err;
								y = JSON.parse(JSON.stringify(result, null, 2));
								var TypeArray = [];
								if (y[0].Type == null){
									
									r.table('users').filter(r.row("UserName").eq(UserName)).update(
									   {Type:  r.row("Type").default([]).append(NewType)}
									).run(connection, function(err, result) {
								        if (err) throw err;
								        console.log(JSON.stringify(result, null, 2));
								    });



								}else{



								
								for (i = 0; i < y[0].Type.length; i++) { 
								     TypeArray.push(y[0].Type[i].Type); 
								}								
								if(TypeArray.includes(StringType) == false && StringType != "" ){
									console.log(y[0].Type.includes(StringType));
									r.table('users').filter(r.row("UserName").eq(UserName)).update(
									   {Type:  r.row("Type").default([]).append(NewType)}
									).run(connection, function(err, result) {
								        if (err) throw err;
								        console.log(JSON.stringify(result, null, 2));
								    });

								}
							}
								
								


						});
						
					});

	}


	function DeleteCurrentIssue(UserName, SocketID){
		console.log("Calling Delete Current Issue");

	    r.table('users').filter(r.row('UserName').eq(UserName)).run(connection, function(err, cursor) {
			if (err) throw err;
			
				cursor.toArray(function(err, result) {
				if (err) throw err;
					x = JSON.stringify(result, null, 2);
					var ProjectObject = JSON.parse(x);
					console.log(ProjectObject[0].CurrentIssue.PastCat);
					AddIssue(UserName , SocketID, "ProjectName", ProjectObject[0].CurrentIssue, 2, ProjectObject[0].CurrentIssue.PastCat, ProjectObject[0].CurrentIssue.PastNum);
					

					


			});
			
		});





	}

	function GetUser(UserName, PassWord){
		var x;
		var y;
		
		r.table('users').filter(r.row('UserName').eq(UserName)).
		run(connection, function(err, cursor) {
			if (err) throw err;
			
				cursor.toArray(function(err, result) {
				if (err) throw err;
					x = JSON.stringify(result, null, 2);
						if (x == null){
							console.log("User Not Found");
							
						}else{
							console.log("User Found:");
							
							var obj = JSON.parse(x);
							console.log(obj[0].Password);
						
						}
					
					
					
					
			});
			
		});
		
		
	}
	function SignInCheck(UserName, PassWord, SocketID){
		var x;
		var y;
		
		r.table('users').filter(r.row('UserName').eq(UserName)).
		run(connection, function(err, cursor) {
			console.log(UserName);
			if (err) throw err;
			
				cursor.toArray(function(err, result) {
				if (err) throw err;
					x = JSON.stringify(result, null, 2);
						if (x == null){
							console.log("User Not Found");
							
						}else{
							console.log("User Found:");
							
							var obj = JSON.parse(x);
							
							bcrypt.compare(PassWord, obj[0].Password, function(err, res) {
    
								
							
								if(res != true){
								
								io.to(SocketID).emit('AuthFail', '');
								
							}else{

								var key = 'https://www.youtube.com/watch?v=adDD43CvrUc';
								var plaintext = String(UserName);
								 
								var encrypted = aes256.encrypt(key, plaintext);
								
								io.to(SocketID).emit('AuthSucc', encrypted);


								console.log(encrypted);
							}
							});
							
						}
					
					
					
					
			});
			
		});
		
		
	}
	

	
	
	
	
	
	
	
	
	
	
	
	

	
	
	//GetUserProjects("Mas2");	

	
	
	
	socket.on('SignUpForm', function(UserName, PassWord, Email, SocketID ){
		
		InsertUser(UserName, PassWord, Email, SocketID);
		AddProject(UserName, SocketID);
	});
	socket.on('SignInForm', function(UserName, PassWord, SocketID ){


		SignInCheck(UserName, PassWord, SocketID);
	});
	socket.on('UserDataReq', function(UserName, SocketID ){
		
	});
	socket.on('CreateNewType', function(UserName, ID, NewType){
		var key = 'https://www.youtube.com/watch?v=adDD43CvrUc';
		encrypted = String(UserName);

		var decrypted = aes256.decrypt(key, encrypted);
		UserName = decrypted;
		console.log('CreateNewType');
		CreateNewType(UserName, ID, NewType);
	});
	socket.on('GetProjects', function(UserName, SocketID ){
		var key = 'https://www.youtube.com/watch?v=adDD43CvrUc';
		encrypted = String(UserName);

		var decrypted = aes256.decrypt(key, encrypted);
		UserName = decrypted;

		GetUserProjects(UserName, SocketID);
	});
	socket.on('CreateProjects', function(UserName, SocketID ){
		var key = 'https://www.youtube.com/watch?v=adDD43CvrUc';
		encrypted = String(UserName);

		var decrypted = aes256.decrypt(key, encrypted);
		UserName = decrypted;

		AddProject(UserName, SocketID);
		
	});
	socket.on('AddExamples', function(UserName, SocketID ){
		var key = 'https://www.youtube.com/watch?v=adDD43CvrUc';
		encrypted = String(UserName);

		var decrypted = aes256.decrypt(key, encrypted);
		UserName = decrypted;

		AddDoing(UserName, SocketID);
		console.log("adding examples");
		
	});

	socket.on('DeleteCurrentIssue', function(UserName, SocketID ){
		var key = 'https://www.youtube.com/watch?v=adDD43CvrUc';
		encrypted = String(UserName);

		var decrypted = aes256.decrypt(key, encrypted);
		UserName = decrypted;

		DeleteCurrentIssue(UserName, SocketID);
		
	});
	socket.on('FeedUpdate', function(UserName, SocketID, Desc, datetime){
		var key = 'https://www.youtube.com/watch?v=adDD43CvrUc';
		encrypted = String(UserName);

		var decrypted = aes256.decrypt(key, encrypted);
		UserName = decrypted;

		FeedUpdate(UserName, SocketID, Desc, datetime);
		
	});
	

	
	//DeleteIssue("Mas2", null , null , null , 0 )
	socket.on('DeleteIssue', function(UserName, SocketID, ProjectName, NumberVar, Category ){
		var key = 'https://www.youtube.com/watch?v=adDD43CvrUc';
		encrypted = String(UserName);

		var decrypted = aes256.decrypt(key, encrypted);
		UserName = decrypted;

		
		DeleteIssue(UserName, SocketID, ProjectName, NumberVar, Category )
	});

	socket.on('CreateCurrentIssue', function(MyUserName, MyID, ProjectName, Issue){
		var key = 'https://www.youtube.com/watch?v=adDD43CvrUc';
		encrypted = String(MyUserName);

		var decrypted = aes256.decrypt(key, encrypted);
		MyUserName = decrypted;
		
		AddCurrentIssue(MyUserName, MyID, "ProjectName", Issue);
		console.log(Issue);
	});
			
	socket.on('CreatIssue', function(MyUserName , MyID, ProjectName, NewIssue, Category, IsSwitch, PastNumber){
	
		var key = 'https://www.youtube.com/watch?v=adDD43CvrUc';
		encrypted = String(MyUserName);

		var decrypted = aes256.decrypt(key, encrypted);
		MyUserName = decrypted;



		//DeleteIssue("Mas2" , MyID, "ProjectName", NewIssue, Category, IsSwitch );
		AddIssue(MyUserName , MyID, "ProjectName", NewIssue, Category, IsSwitch, PastNumber);
	 	console.log(IsSwitch);

	});
})
});





});


http.listen(port, function(){
  console.log('listening on *:' + port);
});




	  
