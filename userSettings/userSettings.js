
import {getUser} from '../postbox/getUser.js'
let user
$(async function () {
    user = await getUser();
    let userId = user.id
    let userName = user.userName;
    let userEmail = user.email
    let userMatchPoint = user.matchPoint
    let userGameScore = user.highestGameScore

    $('#title').append(`<h2 class = contents>Username: ${userName}</h2>`)
    $('#title').append(`<h2 class = contents>Email: ${userEmail}</h2>`)
    
    $('#title').append(`<h2 class = contents>Your Personality Score: </h2>`)
    $('#title').append(`<h2 class = contents>
        Extraversion: ${userMatchPoint[0]} --
        Agreeableness: ${userMatchPoint[0]} --
        Conscientiousness: ${userMatchPoint[0]} --
        Emotional_stability: ${userMatchPoint[0]} --
        Intellect: ${userMatchPoint[0]}
        </h2>`)
    $('#title').append(`<h2 class = contents>Your Highest Game Point: ${userGameScore}</h2>`)
    $('#logoutButton').on('click', handleLogOut);

    document.getElementById('changePassword').addEventListener('click', async () => {
        var password = prompt("Please Enter Your New Password", "");
        if (password != null && password != "") {
            user.password = password
            try{
                const result = await axios({
                    method: 'put',
                    url: `https://us-central1-comp426-firebase.cloudfunctions.net/users/${userId}`,
                    data: user
                });     
            } catch{
                console.error('put following error')
            }
        }
        confirm("Your Password has been changed!") 
    })
});

const handleLogOut = function(){
    deleteCookie('info')
    window.location.href = "../index.html";
};