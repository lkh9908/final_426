let current_id = null
let current_user = null
let current_email = null
let user = null

export async function getUser(){
    let cookie = getCookie('info')
    var re = ',';
    var cookieList = cookie.split(re);

    current_id = cookieList[0]
    current_user = cookieList[1]
    current_email = cookieList[2]

    try {
        const result = await axios({
            method: 'get',
            url: `https://us-central1-comp426-firebase.cloudfunctions.net/users/${current_id}`
        });
    
        user = {
            id: "",
            userName: "",
            email: "",
            password: "",
            matchPoint: [],
            friends: [],
            highestGameScore: 0
        }

        user.id = result.data.id
        user.userName = result.data.userName
        user.email = result.data.email
        user.password = result.data.password
        user.matchPoint = result.data.matchPoint
        user.friends = result.data.friends
        user.highestGameScore = result.data.highestGameScore
        return user
    } catch {
        console.error("something went wrong pulling this user");
    }    
}




export async function upDateUser(currentScore){

    user.highestGameScore = currentScore

    const result = await axios({
        method: 'put',
        url: `https://us-central1-comp426-firebase.cloudfunctions.net/users/${current_id}`,
        data: user
    });     
}
