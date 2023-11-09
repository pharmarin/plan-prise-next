-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `_MedicamentToPlan` (
	`A` varchar(191) NOT NULL,
	`B` varchar(191) NOT NULL,
	CONSTRAINT `_MedicamentToPlan_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `_MedicamentToPrincipeActif` (
	`A` varchar(191) NOT NULL,
	`B` varchar(191) NOT NULL,
	CONSTRAINT `_MedicamentToPrincipeActif_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`provider` varchar(191) NOT NULL,
	`providerAccountId` varchar(191) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(191),
	`scope` varchar(191),
	`id_token` text,
	`session_state` varchar(191),
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `accounts_provider_providerAccountId_key` UNIQUE(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `calendriers_old` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` text NOT NULL,
	`data` text NOT NULL,
	`TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `calendriers_old_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `commentaires` (
	`id` varchar(191) NOT NULL,
	`voieAdministration` enum('ORALE','CUTANEE','AURICULAIRE','NASALE','INHALEE','VAGINALE','OCULAIRE','RECTALE','SOUS_CUTANEE','INTRA_MUSCULAIRE','INTRA_VEINEUX','INTRA_URETRALE','AUTRE'),
	`population` varchar(191),
	`texte` text NOT NULL,
	`medicamentId` varchar(191) NOT NULL,
	CONSTRAINT `commentaires_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medicaments` (
	`id` varchar(191) NOT NULL,
	`denomination` varchar(191) NOT NULL,
	`indications` json NOT NULL,
	`conservationFrigo` tinyint NOT NULL,
	`conservationDuree` json,
	`voiesAdministration` json NOT NULL,
	`medics_simpleId` int NOT NULL,
	`precautionId` int,
	`precaution_old` varchar(191),
	CONSTRAINT `medicaments_id` PRIMARY KEY(`id`),
	CONSTRAINT `medicaments_denomination_key` UNIQUE(`denomination`)
);
--> statement-breakpoint
CREATE TABLE `medics_simple` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nomMedicament` varchar(200),
	`nomGenerique` varchar(100),
	`indication` text,
	`frigo` tinyint NOT NULL DEFAULT 0,
	`dureeConservation` text,
	`voieAdministration` varchar(50),
	`matin` varchar(20),
	`midi` varchar(20),
	`soir` varchar(20),
	`coucher` varchar(20),
	`commentaire` text,
	`modifie` varchar(20) DEFAULT 'NOW()',
	`precaution` varchar(50),
	`qui` varchar(10),
	`relecture` int DEFAULT 0,
	`stat` int NOT NULL DEFAULT 0,
	CONSTRAINT `medics_simple_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` varchar(191) NOT NULL,
	`medicsOrder` json NOT NULL,
	`data` json,
	`settings` json,
	`userId` varchar(191),
	`displayId` int NOT NULL,
	CONSTRAINT `plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plans_old` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` varchar(50) NOT NULL,
	`data` mediumtext NOT NULL,
	`options` text,
	`TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `plans_old_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `precautions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mot_cle` varchar(50) NOT NULL,
	`titre` varchar(200) NOT NULL,
	`contenu` text NOT NULL,
	`couleur` varchar(10) NOT NULL,
	CONSTRAINT `precautions_id` PRIMARY KEY(`id`),
	CONSTRAINT `precautions_mot_cle_key` UNIQUE(`mot_cle`)
);
--> statement-breakpoint
CREATE TABLE `principes_actifs` (
	`id` varchar(191) NOT NULL,
	`denomination` varchar(191) NOT NULL,
	CONSTRAINT `principes_actifs_id` PRIMARY KEY(`id`),
	CONSTRAINT `principes_actifs_denomination_key` UNIQUE(`denomination`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(191) NOT NULL,
	`sessionToken` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_sessionToken_key` UNIQUE(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`admin` tinyint NOT NULL DEFAULT 0,
	`firstName` varchar(191),
	`lastName` varchar(191),
	`displayName` varchar(191),
	`student` tinyint NOT NULL,
	`certificate` longtext,
	`rpps` bigint,
	`password` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3),
	`approvedAt` datetime(3),
	`maxId` int NOT NULL DEFAULT 1,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `_MedicamentToPlan_B_index` ON `_MedicamentToPlan` (`B`);--> statement-breakpoint
CREATE INDEX `_MedicamentToPrincipeActif_B_index` ON `_MedicamentToPrincipeActif` (`B`);--> statement-breakpoint
CREATE INDEX `accounts_userId_idx` ON `accounts` (`userId`);--> statement-breakpoint
CREATE INDEX `commentaires_medicamentId_idx` ON `commentaires` (`medicamentId`);--> statement-breakpoint
CREATE INDEX `medicaments_medics_simpleId_idx` ON `medicaments` (`medics_simpleId`);--> statement-breakpoint
CREATE INDEX `medicaments_precautionId_idx` ON `medicaments` (`precautionId`);--> statement-breakpoint
CREATE INDEX `plans_userId_idx` ON `plans` (`userId`);--> statement-breakpoint
CREATE INDEX `sessions_userId_idx` ON `sessions` (`userId`);
*/