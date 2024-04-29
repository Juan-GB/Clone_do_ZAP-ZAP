const { Client, Databases, ID, Query } = Appwrite;

const client = new Client();
const projectID = "662464027b2455806969";
const databaseID = "662465414facdf296fc9";
const collectionID = "66246555cb81c974f3de";

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(projectID);

const databases = new Databases(client);

let myName = "Juan";
const messagesContainer = document.querySelector('#messages-container')

async function placeMessages() {
    myName = document.querySelector('#input-nome').value;

    let messagesArray = await getMessagesFromDB();
    messagesContainer.innerHTML = '';

    if(messagesArray.total != 0) {
        messagesArray.documents.forEach(e => {
            switch (e.name) {
                case myName:
                    createElement({destino: "remetente", element: e});
    
                    break;
            
                default:
                    createElement({destino: "destinatario", element: e});
    
                    break;
            }
        });
    }
}

async function getMessagesFromDB() {
    let totalMessages = await databases.listDocuments(
        databaseID,
        collectionID,
        [
            Query.limit(1),
        ]
    );

    let messagesArray = await databases.listDocuments(
        databaseID,
        collectionID,
        [
            Query.limit(totalMessages['total']),
        ]
    );

    return messagesArray;
}

function createElement({destino, element}) {
    let div = document.createElement('div');
    div.className = `${destino} mensagem`;

    let spanMensagem = document.createElement('span');
    spanMensagem.innerHTML = element["message"];

    let spanHour = document.createElement('span');
    spanHour.className = 'hora';
    spanHour.innerHTML = element["hour"];

    if(destino == "destinatario") {
        let spanNome = document.createElement('span');
        spanNome.className = "nome";
        spanNome.innerHTML = element["name"];
        div.appendChild(spanNome);
    }

    div.appendChild(spanMensagem);
    div.appendChild(spanHour);

    messagesContainer.appendChild(div);
}

async function sendMessage() {
    myName = document.querySelector('#input-nome').value;
    let mensagem = document.querySelector('#text-input').value;
    let hora = `${new Date().getHours()}:${new Date().getMinutes()}`;
    
    if(myName != '' && myName.length > 1 && mensagem.value != '') {
        try {
            let response = await databases.createDocument(
                databaseID,
                collectionID,
                ID.unique(),
                {
                    name: myName,
                    message: mensagem,
                    hour: hora
                }
            );

            mensagem.value = '';
            placeMessages();
        } catch (error) {
            console.log(error);
            placeMessages();
        }
    }
}