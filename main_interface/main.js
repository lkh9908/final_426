
var socket = undefined;
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();  
});

function buildConnection(){
  socket = io();
  socket.on('message', message=>{
    console.log(message)
  })

  socket.on('chatMessage', message=>{
    renderOthers(message);
  })

}
buildConnection()
async function loadFollowing(){
  
  const column = $('#follow_column');
  const id = getCookie('info').split(', ')[0];
  const result = await axios({
    method: "get",
    url: `https://us-central1-comp426-firebase.cloudfunctions.net/users/${id}`
  });
  if(result.data.following.length===0){
    column.append('<h3 id="target">You follow no one</h3>');
    return;
  }
  result.data.following.map(follow=>{
    const div = `<div id = "${follow.username}" class="individual">
    <p style="font-size: larger">${follow.username}</p><span style="relative;left: 50px">${follow.email}</span><button style="float: right; position: relative; top: -15px"><i class="fas fa-minus-square fa-2x"></i></button>
    <br>
    </div>`;
    column.append(div);
  });
}
loadFollowing();
$('.textarea').keydown(function (e) {

  if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey){
    const value = event.target.value;
    if(!value) {return}
    socket.emit('chatMessage', value);
    render(value);
    $('#chat-ul').scrollTop = $('#chat-ul').scrollHeight;
    event.target.value='';
    event.target.focus();
  }
});

function showChat(){
  $('#black_shadow').css('visibility', 'visible');
  $('#black_shadow').css('visibility', 'visible');
  var temp = $('#chatWindow');
  temp.css('visibility', 'visible');
  buildConnection();
  let chat_ul = document.getElementById('chat-ul')
  //need to load history
  chat_ul.scrollTop = chat_ul.scrollHeight;
}


function leave2(){
  $('#black_shadow').css('visibility', 'hidden');
  $('#add_follow_window').css('visibility', 'hidden')
}

async function showFollow(){
  $('#black_shadow').css('visibility', 'visible');
  $('#add_follow_window').css('visibility', 'visible');
  const result = await axios({
    method: "get",
    url: "https://us-central1-comp426-firebase.cloudfunctions.net/users"
  });
  localUsers.splice(0,localUsers.length)
  result.data.map(user=>{
    if(user.userName === getCookie('info').split(', ')[1]){
      return
    }
    localUsers.push({id: user.id, username: user.userName, email: user.email})
  })
}

async function confirmFollow(){
  if(!$('#follow_input').val()) return
  if($('#'+$('#follow_input').val())){
    alert('alert!')
    return
  }
  const id = getCookie('info').split(', ')[0];
  const result = await axios({
    method: "get",
    url: `https://us-central1-comp426-firebase.cloudfunctions.net/users/${id}`
  });
  const newFollowList = result.data.following;
  const newFollow = localUsers.filter(user=>user.username==$('#follow_input').val())[0];
  newFollowList.push(newFollow);
  const result2 = await axios({
    method: "put",
    url: `https://us-central1-comp426-firebase.cloudfunctions.net/users/${id}`,
    data: {
      "userName": result.data.userName,
      "matchPoint": result.data.matchPoint,
      "email": result.data.email,
      "password": result.data.password,
      "following": newFollowList,
      "highestGameScore": result.data.highestGameScore

    }
  });
  $('#target').html('');
  const div = `<div id = "${newFollow.username}" class="individual">
  <p style="font-size: larger">${newFollow.username}</p><span style="float: right;position: relative; top: -15px">${newFollow.email}</span><button ><i class="fas fa-minus-square fa-2x"></i></button>
  <br>
  </div>`;
  $('#follow_column').append(div);
  $('#follow_input').val('');
  $('#search_res').empty();
  leave2();
}


function render(msg){
  $('#chat-ul').append(`<li class = "me">${msg}</li>`);
  let chat_ul = document.getElementById('chat-ul')
  chat_ul.scrollTop = chat_ul.scrollHeight;
}

function renderOthers(msg){
  $('#chat-ul').append(`<li class = "him">${msg}</li>`);
  let chat_ul = document.getElementById('chat-ul')
  chat_ul.scrollTop = chat_ul.scrollHeight;
}