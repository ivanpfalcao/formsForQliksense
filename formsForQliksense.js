define( ["qlik", "jquery", "text!./style.css"], function ( qlik, $, cssContent) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );
	return {
		initialProperties: {
			qListObjectDef: {
				qShowAlternatives: true,
				qFrequencyMode: "V",
				qInitialDataFetch: [{
					qWidth: 2,
					qHeight: 50
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				settings: {
					uses: "settings"
				},
				scriptURL: {                           
					type: "string",                  
					//ref: "fieldName",                    
					ref: "scriptURL",                    
					label: "Script URL",                  
					expression: "always",          
					defaultValue: "Script URL"            
				},	
				buttonConfig: {
					component: "expandable-items",
					label: "Button configurations",
					items: {
						buttonText: {                           
							type: "string",                  
							//ref: "fieldName",                    
							ref: "buttonText",                    
							label: "Submit Button Description",                  
							expression: "always",          
							defaultValue: "Submit"
						},	

						separateSubButtonSwitch: {
							type: "boolean",
							component: "switch",
							label: "Button Position",
							ref: "separateSubButtonSwitch",
							options: [{
								value: true,
								label: "next line"
							}, {
								value: false,
								label: "same line"
							}],
							defaultValue: false
						}
					}
				},
				formObjectList: {                              
					type: "array",                       
					ref: "frmObjList",                     
					label: "Form object",    
					itemTitleRef: "label",               
					allowAdd: true,                      
					allowRemove: true,                   
					addTranslation: "Add Item",    					
					items: {                                                             
						label: {                           
							type: "string",                  
							//ref: "fieldName",                    
							ref: "label",                    
							label: "Object Description",                  
							expression: "always",          
							defaultValue: "Object Description"            
						},
						objectId: {                           
							type: "string",                  
							//ref: "fieldName",                    
							ref: "objectId",                    
							label: "Object ID",                  
							expression: "always",          
							defaultValue: "Object ID"            
						},	
						objectName: {                           
							type: "string",                  
							//ref: "fieldName",                    
							ref: "objectName",                    
							label: "Object Name",                  
							expression: "always",          
							defaultValue: "Object Name"            
						},							
						typeDropdown: {
							type: "string",
							component: "dropdown",
							label: "Object Type",
							ref: "objectType",
							options:[
								{
									value: "text",
									label: "Text"
								}, 
								{
									value: "password",
									label: "Password"
								}, 
								{
									value: "file",
									label: "File"
								}, 
								{
									value: "checkbox",
									label: "Checkbox"
								}
								
							],
							defaultValue: "text"																	
						},
						separateLabelSwitch: {
							type: "boolean",
							component: "switch",
							label: "Label Position",
							ref: "separateLabelSwitch",
							options: [{
								value: true,
								label: "next line"
							}, {
								value: false,
								label: "same line"
							}],
							defaultValue: false
						},
						separateFieldSwitch: {
							type: "boolean",
							component: "switch",
							label: "Field Position",
							ref: "separateFieldSwitch",
							options: [{
								value: true,
								label: "next line"
							}, {
								value: false,
								label: "same line"
							}],
							defaultValue: false
						}						
					}					
					
				},
				MethodDropdown: {
						type: "string",
						component: "dropdown",
						label: "Form Method",
						ref: "formMethod",
						options:[
							{
								value: "post",
								label: "Post"
							}, 
							{
								value: "get",
								label: "Get"
							}							
						],
						defaultValue: "post"																	
				}				
			}
		},
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		paint: function ( $element,layout ) {
			var self = this, html = '';
			//html += '<input name="file" class="fileSelector" type="file" id="fileinput-1" multiple="multiple" onpropertychange="if(window.event.propertyName=="value"){alert(this.value);}"/>';
			//html += ' <button class="upl-btn" id="subBtn-1" type="button">Upload!</button>'
			
			if (typeof layout.frmObjList != 'undefined'){
				var lenObjectList = layout.frmObjList.length;

				//var scriptName = "http://localhost:8000/PHP Scripts/Classes/PHPUploadFile.php";
				var scriptName = layout.scriptURL;
				
				var messageText = "selecione o arquivo: ";
				var btnText = layout.buttonText;
				var formMethod = layout.formMethod;
				var brMap = {true:"<br>",false: ""};
				var separateSubButton = layout.separateSubButtonSwitch;

				html+='<form action="' + scriptName + '" method="' + formMethod + '" enctype="multipart/form-data" target="iframe">';
				//html+='<ul>';
				
				for (var i=0;i<lenObjectList;i++){
					var objectDescription=layout.frmObjList[i].label;
					var objectID=layout.frmObjList[i].objectId;
					var objectType=layout.frmObjList[i].objectType;
					var objectName=layout.frmObjList[i].objectName;
					var separateLabel=layout.frmObjList[i].separateLabelSwitch;
					var separateObject = layout.frmObjList[i].separateFieldSwitch;
					
					//alert(objectDescription);
					//alert(objectID);
					//alert(objectType);
				
					
					//html+='<li>';
					html+=brMap[separateObject];
					html+='<label for="' + objectID + '">' + objectDescription + '</label>' + brMap[separateLabel];
					html+=' <input type="'+ objectType +'" id="' + objectID +'" name="' + objectName + '">';
					//html+='</li>';
				}
				
				//html+='<li>';
				html+=brMap[separateSubButton];
				html+='<input class="btn-submit" type="submit" value="' + btnText + '" name="submit">';
				//html+='</li>';
				//html+='</ul>';
				html+='</form>';
			}
			
			$element.html( html );
			
			
			/*
			$( '.upl-btn' ).click(function() {
				//alert("button!");
				var btnId= this.getAttribute("id");
				var objId = btnId.split("-")[1];
				var fileObjId = "#fileinput-" + objId;
				//alert(fileObjId);
				//alert($( fileObjId ).attr("type"));
				
				//var fileObj = $( fileObjId ).val();
				var fileObj = $( fileObjId )[0].files;
				
				var selectionList=""
				for(var i = 0; i<fileObj.length; i++){
					var file =  fileObj[i];
					alert(file.name);
					/*
					selectionList+='<ul>';
					var file =  fileObj[i];
					alert(file.name);
					selectionList+="<li> name : " + file.name + "</li>";
					selectionList+="<li> size : " + file.size + "</li>";
					selectionList+="<li> type : " + file.type + "</li>";
					selectionList+="<li> date : " + file.lastModified + "</li>";	
					
					
				}
				selectionList+='</ul>';		
				//$element.html( html + selectionList);
				//alert($( fileObjId ).val());
				//alert($('#fileinput').attr('id'));
			});
			*/
			/*
			$( 'input[name="file"]' ).change(function() {
				
				var selectionList=""
				for(var i = 0; i<this.files.length; i++){
					selectionList+='<table><tr>';
					var file =  this.files[i];
					selectionList+="<tr><td> name : " + file.name + "</td></tr>";
					selectionList+="<tr><td> size : " + file.size + "</td></tr>";
					selectionList+="<tr><td> type : " + file.type + "</td></tr>";
					selectionList+="<tr><td> date : " + file.lastModified + "</td></tr>";	
					
				}
				//html+='</tr></table>';
				$element.html( html + selectionList);
			});
			*/
			

			return qlik.Promise.resolve();
			
				
			
		}
	};
} );
