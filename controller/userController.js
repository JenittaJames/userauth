const userSchema = require('../model/userModel')
const bcrypt = require('bcrypt');


const registerUser = async (req,res)=>{


    try {
        
        const {email,password} = req.body

        //validate input
        
        if(!email) {
           req.flash('error_msg','Email is required !!!');
           return res.redirect('/register')
        }    

        if(!password){
            req.flash('error_msg','Password is required');
            return res.redirect('/register')
        }

        const user = await userSchema.findOne({email})

        if(user) {
            req.flash('error_msg',"User already registered")
            return res.redirect('/register')
        }

            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = new userSchema({
                email,
                password: hashedPassword
            })


        await newUser.save()
        req.flash('success_msg','Registered Successfully');
        return res.redirect('/');


    } catch (error) {

       req.flash('error_msg','Something went wrong. Please try again')
       return res.redirect('/register')
        
    }


}



const login = async (req,res)=>{
    
    try {

        const {email,password} = req.body

        const user = await userSchema.findOne({email})

        if(!user) {
            req.flash('error_msg',"User not found !!!")
            return res.redirect('/login')
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch) {
            req.flash('error_msg','Password does not match');
            return res.redirect('/login')
        }

        req.session.user = true
        req.flash("success_msg","Login successfully")

        return res.redirect('/')
        
    } catch (error) {

       req.flash('error_msg','Something went wrong')
       return res.redirect('/login')
        
    }
}


const loadRegister = (req,res)=>{

    try {
        res.render('user/register')
    } catch (error) {
        console.log(error.message);   
    }

}


const loadLogin = (req,res)=>{
   try {
    res.render('user/login')
   } catch (error) {
    console.log(error.message);
   }
}


const loadHome = (req,res)=>{
   try {
    res.render('user/userHome')
   } catch (error) {
    console.log(error.message); 
   }
}


const logout = (req,res)=>{
    try {
        req.session.user = false
        res.render('user/login',{success_msg: 'User logout successfully'})
    } catch (error) {
        console.log(error.message); 
    }
}


module.exports = {

    registerUser,
    loadRegister,
    loadLogin,
    login,
    loadHome,
    logout
}