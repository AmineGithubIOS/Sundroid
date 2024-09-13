# SunDroid Discord Bot

⚠️ **IMPORTANT : Veuillez lire attentivement la licence avant d'utiliser ou de modifier ce bot. L'utilisation de ce code implique l'acceptation des termes de la licence, qui inclut des restrictions spécifiques sur la certification du bot.** ⚠️

SunDroid est un bot Discord polyvalent conçu pour améliorer la gestion et l'expérience utilisateur de votre serveur.

## Licence

Ce projet est sous une licence personnalisée qui **interdit explicitement la certification ou la vérification du bot**. Veuillez lire le fichier `LICENSE` dans ce dépôt pour comprendre vos droits et obligations avant d'utiliser, de modifier ou de distribuer ce code.

## Fonctionnalités

Le bot est organisé en plusieurs catégories de commandes :

### Gestion
- `bump.js`: Gestion des bumps du serveur
- `level-systeme.js`: Système de niveaux pour les membres
- `setup-bump.js`: Configuration du système de bump
- `setup-captcha.js`: Mise en place d'un système de captcha

### Informations
- `bot-info.js`: Affiche les informations sur le bot
- `help.js`: Commande d'aide et liste des commandes
- `memberCount.js`: Affiche le nombre de membres du serveur
- `ping.js`: Vérifie la latence du bot
- `server-banner.js`: Affiche la bannière du serveur
- `server-icon.js`: Affiche l'icône du serveur
- `server-infos.js`: Fournit des informations détaillées sur le serveur

### Modération
- `ban.js`: Bannit un membre du serveur
- `clear.js`: Supprime un certain nombre de messages
- `kick.js`: Expulse un membre du serveur
- `mute.js`: Rend muet un membre
- `renew.js`: Renouvelle un canal
- `role-add.js`: Ajoute un rôle à un membre
- `role-remove.js`: Retire un rôle à un membre
- `timeout.js`: Met un membre en timeout
- `unban.js`: Débannit un membre
- `unmute.js`: Redonne la parole à un membre muet

### Utilitaire
- `emoji-mixer.js`: Mélange des emojis
- `remind.js`: Définit un rappel

## Configuration

Pour configurer le bot, utilisez le fichier `config.json` avec les paramètres suivants :

```json
{
    "token": "Your bot token",
    "color": "#FF0000",
    "invite": "Your bot invite",
    "image": "Your bot banner",
    "mongoose": "Your mongoose database link"
}
```

Assurez-vous de remplacer les valeurs par défaut par vos propres informations.

## Installation

1. Clonez ce dépôt
2. Installez les dépendances avec `npm install`
3. Configurez le fichier `config.json`
4. Lisez attentivement le fichier `LICENSE`
5. Lancez le bot avec `node index.js`

## Contribution

Les contributions sont les bienvenues ! Cependant, veuillez noter que toute contribution doit respecter les termes de la licence, y compris l'interdiction de certification du bot. N'hésitez pas à ouvrir une issue ou à proposer une pull request.

## Avertissement

En utilisant ce code, vous acceptez de ne pas chercher à obtenir une certification ou une vérification officielle pour le bot créé avec ce code. Assurez-vous de comprendre pleinement les implications de la licence avant d'utiliser ou de modifier ce projet.

---

Créé avec ❤️ par addamsontop
