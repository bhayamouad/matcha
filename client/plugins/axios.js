export default function ({ $axios, store}) {
    $axios.onResponse(res =>{
        if(res.headers.acctok)
            store.commit('auth/setAccTok', res.headers.acctok)
            
        //  hi mouad to test this  plugin uncomment the last line 
        // and change accTokenExp in the api to 10 seconds 
        // refresh the ip:8080/home multiple times and watch the console
        // ps : to be able to use the header we need to expose the header check app.js in the Api
        
        //console.log(res.headers.acctok)
    })

}