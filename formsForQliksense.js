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
				styleConfig: {
					component: "expandable-items",
					label: "Style configurations",
					items: {
						cssClassName: {                           
							type: "string",                                     
							ref: "cssClassName",                    
							label: "CSS Class Name",                  
							expression: "always",          
							defaultValue: ""
						},	
						cssFilePath: {                           
							type: "string",                                
							ref: "cssFilePath",                    
							label: "CSS File Path",                  
							expression: "always",          
							defaultValue: ""
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
							ref: "label",                    
							label: "Object Description",                  
							expression: "always",          
							defaultValue: "Object Description"            
						},
						objectId: {                           
							type: "string",                                     
							ref: "objectId",                    
							label: "Object ID",                  
							expression: "always",          
							defaultValue: "Object ID"            
						},	
						objectName: {                           
							type: "string",                                    
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
								}, 
								{
									value: "radio",
									label: "Radio Button"
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
						},
						RadioTextArea: {
							label:"Radio Button Options",
							component: "textarea",
							rows: 7,//the amount of rows in the textarea component (default is 3)
							maxlength: 5000,//will not allow more than 5000 characters
							ref: "RadioTextArea"
						},	
						RadioExplanation1: {
							label:"Radio Buttons Area uses a Key/Value Sintax:",
							component: "text"
						},							
						RadioExplanation2: {
							label:"Radio Text:::Radio Value",
							component: "text"
						},	
						RadioExplanation3: {
							label:"Use ';;;' as separator between options and ':::' between key and value",
							component: "text"
						},
						RadioExplanation4: {
							label:"Example = Text1:::Value1;;;Text2:::Value2",
							component: "text"
						},
						separateRadios: {
							type: "boolean",
							component: "switch",
							label: "Radios Position",
							ref: "separateRadios",
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
				var btnText = layout.buttonText;
				var formMethod = layout.formMethod;
				var brMap = {true:"<br>",false: ""};
				var separateSubButton = layout.separateSubButtonSwitch;
				var cssClassNm = layout.cssClassName;
				var cssFilePth = layout.cssFilePath;
				
				if (cssFilePth.length>0) {
					//$( "<style>" ).attr('href',cssFilePth);
					var linkElement = "<link id='dynamic-stylesheet' rel='stylesheet' href='" + cssFilePth + "' type='text/css' media='screen'>";
					$("link[id='dynamic-stylesheet']").remove();
					$("head").append(linkElement);
				} else {
					$("link[id='dynamic-stylesheet']").remove();
				}
				
				if (cssClassNm.length>0) {
					var divConfiguration='<div class="' + cssClassNm + '">';
				} else {
					var divConfiguration='<div>';
				}
				
				
				html+=divConfiguration;

				html+='<form action="' + scriptName + '" method="' + formMethod + '" enctype="multipart/form-data" target="iframe">';
				//html+='<ul>';
				
				for (var i=0;i<lenObjectList;i++){
					var objectDescription=layout.frmObjList[i].label;
					var objectID=layout.frmObjList[i].objectId;
					var objectType=layout.frmObjList[i].objectType;
					var objectName=layout.frmObjList[i].objectName;
					var separateLabel=layout.frmObjList[i].separateLabelSwitch;
					var separateObject = layout.frmObjList[i].separateFieldSwitch;
					var separateRadios = layout.frmObjList[i].separateRadios;
					
					
					
					
					
					//alert(objectDescription);
					//alert(objectID);
					//alert(objectType);
				
					
					//html+='<li>';
					html+=brMap[separateObject];
					html+='<label for="' + objectID + '">' + objectDescription + '</label>' + brMap[separateLabel];
					
					
					if (objectType=='radio') {
						var radioText = layout.frmObjList[i].RadioTextArea;
						var radioItems = radioText.split(";;;");
						
						var radioItemslen = radioItems.length;
						//alert(radioItemslen);
						for (var kk=0;kk<radioItemslen;kk++) {
							var radioKey = radioItems[kk].split(':::')[0];
							var radioValue = radioItems[kk].split(':::')[1];
							//alert(radioValue);
							//alert(radioKey + ' & ' +radioValue);
							html+=' <input type="'+ objectType +'" id="' + objectID +'" name="' + objectName + '" value="'+radioValue+'">' + radioKey + brMap[separateRadios];
						}
					} else {
						html+=' <input type="'+ objectType +'" id="' + objectID +'" name="' + objectName + '">';
					}
					
					//html+='</li>';
				}
				
				//html+='<li>';
				html+=brMap[separateSubButton];
				html+='<input class="btn-submit" type="submit" value="' + btnText + '" name="submit">';
				//html+='</li>';
				//html+='</ul>';
				html+='</form>';
				html+='</div>';
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
