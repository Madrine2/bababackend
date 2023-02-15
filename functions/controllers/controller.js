
const admin=require('../assets/db')
const db=admin.firestore();
const fs = require('fs');
exports.addComingUp=async(req,res)=>{
    const {id,name,loc} =req.body
    
   //code refactor
    try{

     const data=await db.collection('comingup').doc('babatv').update({
        'days.Tuesday':admin.firestore.FieldValue.arrayUnion({id,name,loc})
     })


     return res.status(200).json({success:data})
  }catch(error){
   console.log("Something wrong happened")
   return res.status(500).json({
       success:false,
       message:error.message
   })
  }
}

exports.addToProgramLineUp=async(req,res)=>{
    const{description,name,time,day,RadioOrTv}=req.body

    myDaySelection= `days.${day}`


    try{

        const data=await db.collection('programsLineup').doc(RadioOrTv).update({
            [`days.${day}`]:admin.firestore.FieldValue.arrayUnion({description,name,time})
        })
   
   
        return res.status(200).json({success:data})
     }catch(error){
      console.log("Something wrong happened")
      return res.status(500).json({
          success:false,
          message:error.message
      })
     }
}

//register user
exports.register=async(req,res)=>{

    try{
    const {email,name,password,role,image}=req.body


    if(!email || !name || !password || !role || !image ){
       return res.status(401).json({
            success:false,
            message:"Empty details"
        })
    }

    //test passed
    const {uid}=await admin.auth().createUser({
        email,
        name,
        password,
        
    })
    //create role based custom claims
    await admin.auth().setCustomUserClaims(uid,{role})
    //save the user in database after authenticaion
    const user=await db.collection('admin').doc(uid).set({
        name,email,role,password,image
    })
    res.status(201).json({
        success:true,
        user,
        uid
    })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

//app settings 
exports.aboutApp=async(req,res)=>{
    const {name,contact,description,developer,image,version,website}=req.body
    try {
     
     const updatedInfo= await db.collection('settings').doc('about').update({
            appName:name,
            contact,
            description,
            developedBy:developer,
            image:image,
            version,
            website
     })
     res.status(200).json({
        success: true,
        updatedInfo
     })
    } catch (error) {
        res.status.status(500).json({
            success: false,
            message:error.message
        })
    }
}

//get all programLineup
exports.getAll=async(req,res)=>{
    
    try{
        const program=await db.collection('programsLineup').doc('babatv').get()
        res.status(201).json({
            success:true,
            programs:program.data()
        })
       console.log(JSON.stringify(program.data()))
    }catch(error){
        res.status.status(500).json({
            success: false,
            message:error.message
        })
    }

}
//all comingup programs
exports.comingUp=async(req,res)=>{
    try{
        const coming=await db.collection("comingup").doc("babatv").get()
        res.status(201).send(coming.data())
        console.log(JSON.stringify(coming.data()))
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//adding podcast,live and vod

exports.addPlv=async(req,res)=>{
    try{
        /*
        categories=[live,podcast,vod]
        stream=tv or radio
        program=program uploaded

        then program data
        description
        messages
        name
        online
        thumbnail
        url
        views
        */
        const {categories, stream,program,description,name,online,thumbnail,url,views} =req.body
        const added=await db.collection('categories').doc(categories).collection(stream).doc(program).set({  
            name,
            description,
            online,
            thumbnail,
            url,
            views 
        })
        res.status(201).json({ data:added})
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}




const storage=admin.storage();
const bucket = storage.bucket('gs://baba-media-group-e0c88.appspot.com')

exports.upload=async (req,res)=>{
    try {
        // Get the file from the request body
        const file = req.body;
    
        // Upload the image to Firebase Storage
        const fileUpload = await bucket.upload(file.path, {
          // Generate a unique file name
          destination: `${Date.now()}-${file.originalname}`,
        });
    
        // Get the URL of the uploaded image
        const imageUrl = fileUpload[0].metadata.mediaLink;
    
        // Store the image URL in Firestore
       
    
        // Send the image URL as a response
        res.send({ url: imageUrl });
      } catch (error) {
        // Handle the error
        res.status(500).send({ error:error.message });
      }
}
//just verify token
exports.verify=async(req,res)=>{
    try{
        const {token}=req.body
        const decoded=await admin.auth().verifyIdToken(token);
        res.send(decoded);
    }catch(error){
        res.send("An error occured")
    }
}


//privacy settings
exports.privacySettings=async(req,res)=>{
    try {
        const {data}=req.body;

        const updatedPrivacy= await db.collection('settings').doc('privacyPolicy').update({
            data
        })

        res.status(200).json({
            success: true,
            updatedPrivacy
         })

    } catch (error) {
        res.status(500).send({ error:error.message });
    }
}

exports.updateData=async(req,res)=>{
    try {
        const data=await db.collection('programsLineup').doc('babafm').collection('days').doc('1').get()
        let snapshot=data.get('programs')
      
        res.send(sample)
    } catch (error) {
        res.send(error)
    }
}

//get users
exports.getAdmin=async(req,res)=>{
    try {
        const data=await db.collection('admin').get()
        let collections=data.docs.map(doc=>doc.data())
        res.status(201).json({
            collections
        })
    } catch (error) {
        res.status(502).json({
           error: error.message
        })
    }
}