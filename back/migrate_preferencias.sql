-- Script para modificar la restricción única de la tabla preferencias
-- Esto permitirá tener múltiples registros con los mismos hechos pero diferente falla_id

-- Paso 1: Eliminar la restricción única actual
ALTER TABLE preferencias 
DROP INDEX unique_tripleta;

-- Paso 2: Crear una nueva restricción única que incluya también falla_id
-- Esto permite múltiples registros con los mismos hechos siempre que la falla_id sea diferente
ALTER TABLE preferencias 
ADD UNIQUE KEY unique_preferencia (usuario_id, hecho_clima_id, hecho_ocasion_id, hecho_estilo_id, falla_id);

