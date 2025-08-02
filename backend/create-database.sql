-- Script SQL pour créer la base de données Nutrition App
-- À exécuter dans MySQL sur le port 3307

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS nutrition_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE nutrition_app;

-- Afficher le statut
SELECT 'Base de données nutrition_app créée avec succès!' as Status;

-- Afficher les informations
SHOW DATABASES LIKE 'nutrition_app';

-- Afficher les paramètres de la base
SELECT 
    SCHEMA_NAME as 'Database',
    DEFAULT_CHARACTER_SET_NAME as 'Charset',
    DEFAULT_COLLATION_NAME as 'Collation'
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'nutrition_app';
