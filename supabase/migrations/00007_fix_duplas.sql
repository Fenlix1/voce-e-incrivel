-- Mantém apenas a PRIMEIRA modalidade de cada registro que tem vírgula
UPDATE adultos SET modalidade = split_part(modalidade, ',', 1) WHERE modalidade LIKE '%,%';
UPDATE criancas SET modalidade = split_part(modalidade, ',', 1) WHERE modalidade LIKE '%,%';
