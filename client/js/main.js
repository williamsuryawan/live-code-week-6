const baseURL = "http://localhost:3000"

const app = new Vue ({
    el: "#app",
    data: {
        users: [],
        loginEmail: '',
        loginPassword: '',
        errLogin: false,
        isLogin: false,
        logEmail: '',
        jokelist: '',
        content:'',
    },
    created() {
        if (localStorage.getItem('access_token')) {
            this.isLogin = true
            this.showMyFavouriteJoke();
            this.showJoke();
        } else {
            this.isLogin = false
        }
    },
    methods: {
        showJoke: function () {
            
            axios
                .get(`${baseURL}/jokes`)
                .then(response => {
                    // this.jokesAll=[]
                    console.log("berhasil dapat random joke", response.data)
                    this.jokelist=response.data.joke
                })
                .catch(error => {
                    console.log("Terjadi error jokes API", error)
                })
        },
        
        loginUser: function() {
            console.log('masuk login')
            let loginUser = {
                email: this.loginEmail,
                password: this.loginPassword
            }
            console.log("input login", loginUser)
            axios
                .post(`${baseURL}/login`, loginUser)
                .then(response => {
                    console.log('Berhasil login', response)
                    localStorage.setItem('access_token', response.data.access_token)
                    this.logEmail= this.loginEmail
                    this.loginEmail =''
                    this.loginPassword =''
                    this.isLogin = true
                    this.errLogin = false;
                    this.showMyFavouriteJoke(); 
                    this.showJoke(); 
                })
                .catch(error => {
                    console.log("terjadi error login", error)
                    this.errLogin = true;
                    this.loginEmail =''
                    this.loginPassword =''
                })
        },
        logoutUser: function () {
            localStorage.removeItem('access_token');
            console.log('User signed out.');
            this.isLogin = false
        },
        favJoke: function (input) {
            console.log("masuk ke favjoke method===", input)
            let favJoke = {
                content: input,
            }
            console.log("cek body", favJoke)
            axios
                .post(`${baseURL}/jokes`, favJoke, {headers: {access_token: localStorage.getItem('access_token')}})
                .then(({data}) => {
                    console.log("make joke favorite berhasil", data.data)
                    this.showMyFavouriteJoke();
                    this.showJoke();
                })
                .catch(error => {
                    console.log("Terjadi error joke API", error)
                })
        },
        showMyFavouriteJoke () {
            console.log("request my saved joke")
            axios
                .get(`${baseURL}/myjokes`, {headers: {access_token: localStorage.getItem('access_token')}})
                .then(({data})=> {
                    this.jokesFav =[]
                    console.log("get my favorite joke berhasil", data.data)
                    data.data.forEach((myfavjoke, index) => {
                        this.jokesFav.push(myfavjoke)
                    })
                    console.log("hasil looping", this.jokesFav)
                })
        },
        dislikeJoke(input) {
            console.log("masuk ke dislike joke method===", input)
            axios
                .delete(`${baseURL}/jokes/${input._id}`, {headers: {access_token: localStorage.getItem('access_token')}})
                .then(({data}) => {
                    console.log("dislike joke favorite berhasil", data.data)
                    this.showMyFavouriteJoke(); 
                    this.showJoke(); 
                })
                .catch(error => {
                    console.log("Terjadi error joke API", error)
                })
        }
    }
})