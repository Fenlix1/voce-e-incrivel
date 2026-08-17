UPDATE adultos SET modalidade = split_part(modalidade, ',', 1) WHERE modalidade LIKE '%,%';
UPDATE criancas SET modalidade = split_part(modalidade, ',', 1) WHERE modalidade LIKE '%,%';
