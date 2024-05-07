const socket = io()
const clinetsTotal = document.getElementById('clints-total')
const messageContainer = document.getElementById('massage-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('massage-form')
const messageInput = document.getElementById('massage-input');
const messageTone = new Audio('/messagetone.mp3')


messageForm.addEventListener('submit' , (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('clinets-total',(data)=>{
    clinetsTotal.innerText = `total People: ${data}`
}) 

function sendMessage(){
    if(messageInput.value == '') return 
// console.log(messageInput.value)
const data = {
    name:nameInput.value,
    message:messageInput.value,
    dateTime: new Date()
    }
    socket.emit('message',data)
    addMessageToUI(true ,data)
    messageInput.value=''
}

socket.on('chat-message',(data)=>{
    messageTone.play()
    addMessageToUI(false, data);
})

function addMessageToUI(isOwnMessage,data){
    clearFeedback()
    const element =` <li class="${isOwnMessage ? "massage-right" :"massage-left"}">
    <p class="message">
        ${data.message}
        <span>${data.name}* ${moment(data.dateTime).fromNow()}</span>
    </p>
</li>`
    messageContainer.innerHTML += element
    scrollToBottom()
}

function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) =>{
    console.log(nameInput.value);
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing`
    })
})

messageInput.addEventListener('keypress', (e) =>{
    console.log(nameInput.value);
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing`
    })
})

messageInput.addEventListener('blur', (e) =>{
    socket.emit('feedback',{
        feedback:``,
    })
})

socket.on('feedback',data=>{
    clearFeedback()
    const element = ` <li class="message-feedback">
    <p class="feedback" id="feedback"> ${data.feedback}</p>
</li>`
messageContainer.innerHTML += element
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    });
}