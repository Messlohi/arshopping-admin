 const isAvailable = document.getElementById("isAvailable");
 const sendBtn = document.getElementById('sendBtn');
 const addcategBtn = document.getElementById('btnCatego');
 const selectCategoy  = document.getElementById('cartegorySelect');
 const uploader = document.getElementById('uploader');

 const database = firebase.database();

 const formData = new FormData(document.querySelector('form'))
 const formAddProduct = document.querySelector('form');


 const imgViewClick = document.getElementById("viewImgClick");
 const imgContainer = document.getElementById('imgContainer');
 const imgShowCase = document.getElementById('imgShowCase');


 
 imgViewClick.style.display = "none";

 imgViewClick.addEventListener('click',(e)=> {
        imgContainer.style.display = "flex";
       imgContainer.style.transform = "scale(1)";
 })

 imgContainer.addEventListener("click",e=>{
    imgContainer.style.transform = "scale(0)";
 })

 



 
 var prodcut = {}
 var file3dModel = null;
 var ImageFile = null;


 database.ref("all_categories").orderByKey().on("child_added", function(snapshot, prevChildKey) {
       const option = new Option(snapshot.val())
       option.value = snapshot.val();
       selectCategoy.add(option,0)
  });




function handleData(product)
{
    var form_data = new FormData(document.querySelector("form"));
    for(var pair of form_data.entries()) 
    {
        prodcut[pair[0]] = pair[1];
    }
    prodcut["isAvailable"] = isAvailable.checked
   // product["titleLowerCase"] = prodcut["title"].toLowerCase()  
}

const uploadToFirebase = (path,file,loader) => {
return new Promise((resolve, reject)=> {
    var seconds = new Date().getTime()
    let ref = firebase.storage().ref(path);
    var task = ref.child(seconds+"-"+file.name).put(file)
    task.then((snapshot)=> {
        var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        loader.value = percentage;
        task.snapshot.ref.getDownloadURL().then((downloadURL) => {
            resolve(downloadURL);
        }).catch(err => reject(err))
    }).catch(err => reject(err))
})
    
}


var file3d =  document.getElementById('3dShapeUrl');
file3d.addEventListener('change', function(e){
   file3dModel = e.target.files[0];
});  

var fileButton =  document.getElementById('ProductImage');
fileButton.addEventListener('change', function(e){
ImageFile = e.target.files[0];
if(ImageFile != null) {
imgViewClick.style.display = "inline";
} else {
imgViewClick.style.display = "none";
return;
}
imgShowCase.src = URL.createObjectURL(ImageFile);

}); 



sendBtn.addEventListener('click',e=> {
    e.preventDefault();
    Promise.all([uploadToFirebase('img/',ImageFile,uploader),uploadToFirebase('models/',file3dModel,uploader)])
    .then((url )=>{
        handleData(prodcut);
        prodcut["id"] = database.ref("all_products").child(prodcut.catego).push().key
        prodcut["urlImage"]  = url[0];
        prodcut["url3dShape"] = url[1];
        database.ref("all_products").child(prodcut.catego).child(prodcut["id"]).set(prodcut);
        formAddProduct.reset();
        uploader.value=0;
    }).catch(err => window.alert(err))
    
})



addcategBtn.addEventListener('click',(e)=> {
    e.preventDefault();
    const categoName = document.getElementById('categoryName').value;
    const key = database.ref("all_categories").push().key
    database.ref("all_categories").child(key).set(categoName);
})




