export default function ({ $axios, store}) {
    $axios.onResponse(res =>{
        if(res.headers.acctok)
            store.commit('auth/setAccTok', res.headers.acctok)
            
        //  hi mouad to test this  plugin uncomment the last line 
        // and change accTokenExp in the api to 10 seconds 
        // refresh the ip:8080/home multiple times and watch the console
        
        //console.log(res.headers.acctok)
    })

}