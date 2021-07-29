
const userpfp = document.querySelector('#userpfp');
const username = document.querySelector('#username');
const userid = document.querySelector('#userid');

const auth = firebase.auth();
const db =firebase.firestore();

auth.onAuthStateChanged(async user =>{
    if(user){
        console.log(user.displayName);
        let shortenedid = user.uid.slice(0,4);
        db.collection('users').doc(user.uid).set({
            shortid:shortenedid,
        }).then(e =>{
            username.textContent = user.displayName;


            db.collection('users').doc(user.uid).get().then(doc =>{
                userid.textContent = `#${doc.data().shortid}`;
            })

            userpfp.src = user.photoURL;
        })
        
    }else{
        console.log('NO');
    }
});


const textsdiv = document.querySelector('.texts');
const sendbtn = document.querySelector('.sendmsg');
const inputbar = document.querySelector('.inputmessages');

const DB = firebase.database();
let ref = DB.ref('Hub-Messages');


ref.on('value', gotData, gotError);



function gotData(data){

let messageslist = document.querySelectorAll('.text');
for(let i = 0; i < messageslist.length; i++){
    messageslist[i].remove();
}

    let messagedata = data.val();
    let keys = Object.keys(messagedata);
    console.log(keys);

    for(i = 0; i < keys.length; i++){
        let k = keys[i];
        let mesage = messagedata[k].message;
        let pfp = messagedata[k].sentbypfp;
        let sentby = messagedata[k].sentbyt;

        console.log(mesage + ' ' + pfp + ' ' + sentby);

        const textdiv = document.createElement('div');
        textdiv.className = 'text';

        textdiv.style.paddingLeft = "15px";
        textdiv.style.paddingBottom = "10px";
        textdiv.style.marginBottom = "14px";

        const textssentdetails = document.createElement('div');
        textssentdetails.className = 'textssentdetails';

        const text_pfp = document.createElement('img');
        text_pfp.className = 'text_pfp';
        text_pfp.src = pfp;

        text_pfp.style.width = "30px";
        text_pfp.style.height = "30px";
        text_pfp.style.borderRadius = "99%";

        textssentdetails.appendChild(text_pfp);

        const text_sent_by = document.createElement('h2');
        text_sent_by.className = 'text_sent_by';
        text_sent_by.innerText = sentby;
        text_sent_by.style.marginLeft = "10px";
        textssentdetails.appendChild(text_sent_by);

        textdiv.appendChild(textssentdetails);


        const text_txt = document.createElement('h3');
        text_txt.className = 'text_txt';
        text_txt.innerText  = mesage;
        textdiv.appendChild(text_txt);


        textsdiv.appendChild(textdiv);

    }
}

function gotError(error){
    console.log('ERROR!');
    console.log(error);
}

sendbtn.addEventListener('click', e =>{
    e.preventDefault();
    let textvalue = inputbar.value;

    if(textvalue === '' || textvalue === ' '){
        alert('Please type in something');
    }
    else{
        auth.onAuthStateChanged(async user =>{
            if(user){
                        
        let data = {
            sentbyt: user.displayName,
            message: textvalue,
            sentbypfp: user.photoURL
        };

        ref.push(data);

        inputbar.value = '';

            }else{
                console.log('NO');
            }
        });
    }

})


