# BookEasy — Plateforme de prise de RDV en ligne

## Le concept

Un professionnel s'inscrit, configure ses disponibilités, et obtient une page publique de réservation qu'il partage à ses clients. Les clients réservent en autonomie, tout le monde gagne du temps.

## Cible

Coiffeurs, coachs, thérapeutes, consultants, professeurs particuliers, photographes — tout indépendant qui prend des rendez-vous.

---

## Parcours du professionnel (inscription)

1. **Inscription** — email + mot de passe + nom de son activité + secteur (coiffure, coaching, etc.)
2. **Configuration initiale guidée (onboarding)** :
   - Quels sont tes jours de travail ?
   - Quelles sont tes horaires ? (ex: lun-ven 9h-18h)
   - Quels services proposes-tu ? (ex: "Coupe homme — 30 min — 25€", "Coloration — 1h30 — 80€")
   - Pause entre chaque RDV ? (ex: 15 min)
3. **Sa page publique est générée** → `bookeasey.fr/salon-marie` — il la partage sur Instagram, Google, sa vitrine...

---

## Parcours du client (réservation)

1. Le client arrive sur `bookeasey.fr/salon-marie`
2. Il voit les services proposés, choisit "Coupe femme — 45 min — 35€"
3. Un calendrier affiche les créneaux disponibles (les créneaux déjà pris sont masqués)
4. Il choisit "Jeudi 19 mars à 14h00"
5. Il entre son nom + téléphone + email
6. Confirmation immédiate à l'écran + email envoyé aux deux parties
7. La veille, rappel automatique par email au client

---

## Ce que voit le professionnel au quotidien

- **Tableau de bord** : les RDV du jour, de la semaine, vue calendrier
- **Liste des RDV** : à venir, passés, annulés
- **Notifications** : "Nouveau RDV : Marie L. — Coupe femme — Jeudi 14h"
- **Gestion des créneaux** : bloquer un jour de congé, modifier ses horaires exceptionnellement

---

## Fonctionnalités gratuites vs premium

| Fonctionnalité | Gratuit | Premium (12€/mois) |
|---|---|---|
| Calendriers/agendas | 1 | Illimités (1 par employé) |
| Page publique de réservation | Oui (avec branding "Propulsé par BookEasy") | Oui (branding retiré) |
| Services configurables | 5 max | Illimités |
| Rappels email automatiques | Oui | Oui |
| Rappels SMS | Non | Oui |
| Paiement en ligne (acompte ou total) | Non | Oui (Stripe) |
| Synchro Google Calendar | Non | Oui (bidirectionnelle) |
| Formulaire personnalisé (questions avant RDV) | Non | Oui |
| Domaine personnalisé | Non (`bookeasey.fr/slug`) | Oui (`rdv.monsalon.fr`) |
| Stats (nb de RDV, taux d'annulation, revenus) | Basiques | Détaillées + export |

---

## Modèle de revenus

- Le pro s'inscrit gratuitement → il teste, il adopte
- Sa page publique affiche **"Propulsé par BookEasy"** → ses clients voient la marque → d'autres pros s'inscrivent (boucle virale)
- Quand il a 2 employés → il doit passer premium pour avoir 2 calendriers
- Quand il veut réduire les no-shows → il passe premium pour les rappels SMS
- Quand il veut des acomptes → premium pour le paiement en ligne

---

## Exemples concrets d'utilisation

- **Coiffeuse** : partage son lien sur sa bio Instagram, ses clients réservent 24h/24 au lieu d'appeler
- **Coach sportif** : 3 types de séances (individuel, duo, groupe), chacune avec durée et prix différents
- **Thérapeute** : active le formulaire pré-RDV pour demander "Motif de consultation" avant la séance
- **Consultant** : synchro Google Calendar pour éviter les conflits avec ses réunions existantes

---

## Avantage concurrentiel

Chaque utilisateur gratuit ramène ses propres clients sur la plateforme = **croissance virale organique**. Chaque page publique de réservation est une porte d'entrée SEO vers BookEasy.

---

## Estimation

- **Temps de développement** : 6-8 semaines
- **Viralité naturelle** : Forte
- **Récurrence d'usage** : Quotidien
- **Revenu potentiel à 500 users** : 2 000 — 3 000€/mois
