# Instruction
- Application simple de chat entre utilisateur(s) (back + front + RabbitMQ as broker)
- Possibilité de création de compte + connexion (authentification)
- Possibilité de faire des groupes de discussion

Après connexion, afficher liste des utilisateurs, cliquer dessus pour lui envoyer un message

Connexion => API HTTP de RabbitMQ

## Interfaces : 
- Interface de connexion
- Interface d'inscription (facultatif, si on a le temps)
- Interface principale : liste des utilisatreurs
- Interface pour saisir et envoyer le message

# Setup
- Ouvrir un terminal sur le dossier back faire npm i
- Ouvrir un terminal sur le dossier front/chat-app-frontend faire npm i
- Installer RabbitMQ : https://www.rabbitmq.com/docs/download
- Lancer mongod depuis le terminal
- Démarrer RabbitMQ service start
- Démarrer MongodbCompass
- Dans front/chat-app-frontend faire npm start
- Dans back faire node server.js
- Enregister un user via l'app et vérifier si la collection s'est bien créée dans MongodbCompass

### Collaborateurs : 

Bidet Nicolas / Martineau Swann / Ramssamy Marie / Prompsy Bastien