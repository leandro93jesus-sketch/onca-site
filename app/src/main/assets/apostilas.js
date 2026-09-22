const BOOKS=[
{
 id:'bk_factorytalk',icon:'🖥️',title:'FactoryTalk View - Guia Prático de Campo',subtitle:'ME, SE, PanelView, Linx, alarmes, trends, faceplates e diagnóstico',color:'linear-gradient(135deg,#174f8f,#0b7c79)',sections:[
  {title:'1. ME e SE: como não se perder',text:[
   'FactoryTalk View ME (Machine Edition) é muito usado em IHM de máquina e PanelView. FactoryTalk View SE (Site Edition) é voltado a supervisórios maiores, aplicações locais ou distribuídas, com servidores e clientes.',
   'Na manutenção, a primeira pergunta deve ser: qual produto, qual versão e qual arquivo está rodando? Isso evita abrir o projeto na versão errada ou gerar um Runtime incompatível.'
  ],check:['Identifique se o projeto é ME ou SE.','Anote a versão do FactoryTalk.','Identifique modelo da IHM ou arquitetura do SE.','Faça backup antes de alterar.'],tip:'Antes de editar qualquer coisa, tire uma foto ou anote o nome do arquivo, versão e caminho de comunicação.'},
  {title:'2. FactoryTalk Linx e o caminho até o CLP',text:[
   'FactoryTalk Linx é a camada de comunicação entre a aplicação e o controlador. O shortcut é um nome lógico usado pelas telas para apontar para um CLP específico.',
   'Quando um objeto aparece com X, a tela pode estar correta; o problema pode estar no shortcut, no caminho online, no controlador ou no nome/escopo da tag.'
  ],check:['Abra Communication Setup.','Confirme o shortcut.','Confirme o controlador correto.','Teste uma tag BOOL simples.','Só depois investigue o objeto.'],tip:'Teste uma única tag conhecida antes de mexer em dezenas de telas.'},
  {title:'3. Tags: Controller Tag, Program Tag e referência',text:[
   'Controller Tags têm escopo no controlador e são mais simples de usar em vários programas e na IHM. Program Tags pertencem a um programa específico e exigem atenção ao caminho de referência.',
   'Se uma tag existe no Studio 5000 mas não aparece no browser do FactoryTalk, confirme o escopo, o controlador online e a atualização da navegação.'
  ],check:['Confirme grafia exata.','Confirme tipo da tag.','Confirme escopo.','Faça Cross Reference no Studio 5000.'],tip:'Não recrie uma tag na IHM só porque não aparece no browser. Primeiro descubra por que ela não está sendo encontrada.'},
  {title:'4. Botões: Momentary, Maintained, Set e Reset',text:[
   'Momentary escreve enquanto o operador pressiona. Maintained mantém ou alterna estado. Set e Reset usam comandos separados. O tipo deve combinar com a lógica do CLP.',
   'Um erro comum é usar o próprio bit de comando para colorir o botão e dar a impressão de que o equipamento realmente mudou de estado. Prefira animar pela confirmação do CLP.'
  ],check:['Defina qual tag é comando.','Defina qual tag confirma o estado.','Defina comportamento ao perder comunicação.','Teste toque curto e toque prolongado.'],tip:'Comando é pedido. Feedback é realidade. Não misture os dois.'},
  {title:'5. Animações que ajudam em vez de enfeitar',text:[
   'Cor, visibilidade, posição, preenchimento e rotação podem facilitar a leitura. A regra é usar animação para transmitir informação de processo, não apenas para deixar a tela bonita.',
   'Evite depender somente de verde e vermelho. Use texto, ícone e estado para que a informação continue clara.'
  ],check:['PARADO','RODANDO','FALHA','BLOQUEADO','SEM COMUNICAÇÃO'],tip:'Se o operador precisa adivinhar o significado de uma cor, o padrão visual precisa ser melhorado.'},
  {title:'6. Alarmes: mensagem, prioridade e sequência',text:[
   'Um alarme deve informar equipamento e condição. “Falha M01” é fraco. “M01 - comando presente sem feedback após 5 s” é muito mais útil.',
   'Em uma parada, abra o histórico e procure o primeiro evento. Vários alarmes posteriores podem ser apenas consequência da causa inicial.'
  ],check:['Mensagem específica.','Timestamp correto.','Reconhecimento quando necessário.','Retorno ao normal.','Prioridade coerente.'],tip:'O primeiro alarme no tempo costuma valer mais para diagnóstico do que o último que ficou ativo.'},
  {title:'7. Trends: transforme defeito intermitente em evidência',text:[
   'Trends permitem comparar variáveis analógicas e digitais ao longo do tempo. Corrente, pressão, velocidade, comando, feedback e falha juntos podem revelar a sequência exata do evento.',
   'Escolha a taxa de amostragem com base na dinâmica do processo. Muito lenta perde eventos; muito rápida produz dados demais.'
  ],check:['Escolha 3 a 6 sinais úteis.','Inclua pelo menos um comando e um feedback.','Reproduza a falha.','Pergunte qual sinal mudou primeiro.'],tip:'Use trends como “filmagem” dos sinais do processo.'},
  {title:'8. Global Objects e parâmetros',text:[
   'Global Objects permitem criar um único objeto e reutilizá-lo para muitos motores, válvulas e inversores. Os parâmetros indicam qual equipamento cada instância representa.',
   'Essa técnica reduz cópia, inconsistência e tempo de manutenção. Uma alteração no objeto padrão pode ser reaproveitada em várias telas.'
  ],check:['Crie objeto genérico.','Defina parâmetros.','Teste M01.','Teste M02.','Evite hardcode desnecessário.'],tip:'Antes de copiar 30 motores, pare e transforme o primeiro em objeto global.'},
  {title:'9. Faceplate de motor e inversor',text:[
   'Um faceplate deve concentrar operação e diagnóstico. Para motor: comando, feedback, permissivos, falha, corrente e horímetro. Para inversor: Ready, Run, Fault, frequência, corrente, setpoint e comunicação.',
   'Separe funções de operador e manutenção. Comandos críticos ou calibração devem respeitar permissões.'
  ],check:['Estado atual.','Comandos.','Permissivos.','Falha/código.','Grandezas.','Comunicação.'],tip:'O melhor faceplate reduz a necessidade de abrir o Studio 5000 para falhas simples.'},
  {title:'10. Runtime MER, backup e restore',text:[
   'No FactoryTalk View ME, o Runtime MER é o arquivo de execução. Ele não deve ser o único backup. Guarde também o projeto de desenvolvimento e registre a versão.',
   'Antes de alterar PanelView, salve uma cópia com data e versão. Após gerar o Runtime, teste comunicação e navegação.'
  ],check:['Modelo da IHM.','Versão do FactoryTalk.','Projeto fonte salvo.','MER salvo.','Nome com data/versão.','Plano de retorno.'],tip:'Backup sem saber restaurar ainda é um risco. Faça teste de recuperação em laboratório quando possível.'},
  {title:'11. FactoryTalk View SE: local e distribuído',text:[
   'Em uma aplicação SE local, os principais componentes ficam concentrados em uma estação. Em uma arquitetura distribuída, HMI Server, Data Server e Clients podem estar em computadores diferentes.',
   'Quando apenas um cliente falha, compare rede, cliente e serviços locais antes de culpar o CLP.'
  ],check:['Localize HMI Server.','Localize Data Server.','Localize Clients.','Documente IP/nomes.'],tip:'Desenhe a arquitetura em uma folha. Isso economiza tempo quando a comunicação falha.'},
  {title:'12. Checklist: objeto com X ou botão que não funciona',text:[
   'Use este roteiro antes de recriar tela ou mexer na lógica.'
  ],check:['A tag existe no CLP?','O CLP está online?','Shortcut está correto?','Escopo da tag está correto?','A tela está escrevendo na tag esperada?','Algum permissivo no CLP bloqueia o comando?','Há outra lógica sobrescrevendo a tag?'],tip:'IHM, CLP e campo formam uma cadeia. Diagnostique uma camada por vez.'}
 ]
},
{
 id:'bk_rockwell',icon:'🧠',title:'Studio 5000 - Guia de Manutenção',subtitle:'Online, Cross Reference, timers, UDT, AOI, comunicação e boas práticas',color:'linear-gradient(135deg,#4d3e9c,#1d6bd1)',sections:[
  {title:'1. Estrutura do projeto Logix',text:['Controller contém I/O, tags e tarefas. Tasks executam Programs, e Programs contêm Routines. Saber essa hierarquia acelera a busca por lógica.'],check:['MainTask','Programs','Routines','I/O Configuration','Controller Tags'],tip:'Quando abrir projeto desconhecido, primeiro mapeie a estrutura. Não comece clicando aleatoriamente.'},
  {title:'2. Upload, Download e Go Online',text:['Upload traz o projeto do controlador para o computador. Download envia o projeto do computador para o controlador. Confundir os dois pode substituir uma lógica em operação.'],check:['Confirme controlador.','Salve backup.','Compare projetos.','Confirme firmware.','Tenha plano de retorno.'],tip:'Se houver dúvida sobre a direção da transferência, pare antes de clicar.'},
  {title:'3. Cross Reference',text:['Cross Reference mostra onde uma tag é usada. Para falhas difíceis, priorize pontos que escrevem na tag. Uma rotina posterior pode sobrescrever um valor.'],check:['Leituras','Escritas','Aliases','Rotina de origem'],tip:'Tag “pisca” ou volta sozinha? Procure múltiplas escritas.'},
  {title:'4. Timers e feedback',text:['Um TON de confirmação é muito usado: se há comando, mas o feedback não chega dentro do tempo, gere falha.'],check:['PRE','ACC','DN','Condição de habilitação','Reset'],tip:'Observe o ACC online. Ele mostra se a condição realmente está mantendo o timer habilitado.'},
  {title:'5. Contadores e tentativas',text:['Use ONS para contar eventos únicos. Uma lógica de 3 tentativas dentro de 60 s pode usar CTU + TON de janela.'],check:['Pulso de tentativa','CTU','Timer de janela','Reset','Falha'],tip:'Sem ONS, um comando mantido pode ser contado várias vezes.'},
  {title:'6. UDT e padronização',text:['UDT agrupa dados de um equipamento: comando, feedback, falha, corrente, velocidade, permissivos e horímetro. Isso melhora organização e integração com faceplates.'],check:['MOTOR_TIPO','VFD_TIPO','VALVULA_TIPO'],tip:'Estrutura de dados bem padronizada simplifica FactoryTalk.'},
  {title:'7. AOI',text:['AOI encapsula uma lógica reutilizável. Uma AOI de motor pode ser instanciada várias vezes. Mudanças exigem cuidado porque afetam todas as instâncias.'],check:['Entradas','Saídas','InOut','Diagnóstico','Documentação'],tip:'AOI deve esconder repetição, não esconder diagnóstico.'},
  {title:'8. MSG e Produced/Consumed',text:['MSG realiza comunicação por instrução. Produced/Consumed fornece troca cíclica configurada entre controladores Logix.'],check:['Rota','Controlador destino','Tipo de dado','Status da mensagem'],tip:'Estruture os dados antes de criar dezenas de mensagens individuais.'},
  {title:'9. Edição online',text:['Em ambiente autorizado, alterações online devem ser pequenas, rastreáveis e testadas. Entenda Accept, Test e Assemble antes de usar.'],check:['Backup','Impacto','Accept','Test','Assemble','Registro'],tip:'Nunca transforme equipamento em produção em laboratório de tentativa e erro.'},
  {title:'10. Método de diagnóstico',text:['Comando → permissivos → intertravamentos → saída → drive/contator → motor → feedback → IHM.'],check:['Siga ordem.','Anote onde a cadeia quebra.','Corrija uma causa por vez.'],tip:'Diagnóstico bom reduz o espaço de busca a cada teste.'}
 ]
},
{
 id:'bk_weg',icon:'⚡',title:'WEG Drives - Guia de Campo',subtitle:'CFW500, CFW11, CFW700, diagnóstico, software e integração',color:'linear-gradient(135deg,#0f7a66,#1a5280)',sections:[
  {title:'1. Antes de parametrizar',text:['Confirme dados de placa do motor, alimentação, aplicação, forma de comando e referência. Não comece alterando parâmetros aleatórios.'],check:['Tensão','Corrente','Frequência','RPM','Potência','Comando','Referência'],tip:'Fotografe ou salve parâmetros antes de uma alteração importante.'},
  {title:'2. Fonte de comando e referência',text:['O drive precisa saber de onde vem o comando Run/Stop e de onde vem a referência de velocidade: IHM local, bornes, comunicação ou outra fonte.'],check:['Run/Stop','Sentido','Referência','Limites','Rampas'],tip:'Drive Ready mas não roda? Confirme se ele está esperando comando da fonte correta.'},
  {title:'3. CFW500 e entradas/saídas',text:['Entradas digitais e analógicas são configuráveis. A função do borne deve combinar com o esquema elétrico e com a lógica esperada.'],check:['DI','DO','AI','AO','Comum','Escala'],tip:'Nunca use apenas a cor do fio como identificação de função.'},
  {title:'4. Integração com CLP',text:['Separe tags de comando e status. Uma estrutura típica possui CMD_RUN, CMD_RESET, SP_HZ, READY, RUN, FAULT, ACT_HZ e ACT_A.'],check:['Comando','Setpoint','Ready','Running','Fault','Hz atual','Corrente'],tip:'A tela deve mostrar quando há perda de comunicação com o drive.'},
  {title:'5. Falha: leia antes de resetar',text:['Código de falha, condição do processo, corrente, tensão e carga ajudam a identificar a causa. Resetar várias vezes pode mascarar um problema recorrente.'],check:['Código','Histórico','Corrente','Barramento','Carga','Comando'],tip:'Registre a falha antes de apagar o histórico.'},
  {title:'6. WPS, WLP e SuperDrive',text:['A ferramenta depende da família e do firmware. Use software oficial compatível para backup, monitoramento e parametrização.'],check:['Modelo','Firmware','Versão do software','Backup'],tip:'Sempre associe o backup ao equipamento correto e à data.'},
  {title:'7. CFW11 e CFW700',text:['Os conceitos de comando, referência, proteção e diagnóstico se repetem, mas os parâmetros e recursos específicos mudam.'],check:['Use manual da família.','Não copie número de parâmetro de outro modelo sem confirmar.'],tip:'Transfira conceitos, não números de parâmetros.'},
  {title:'8. Faceplate WEG no FactoryTalk',text:['Mostre Ready, Run, Fault, frequência, corrente, setpoint, código de falha e comunicação. Proteja Reset conforme nível de acesso.'],check:['Status','Comando','Grandezas','Falha','Comunicação'],tip:'Faceplate bom reduz viagens até o painel.'}
 ]
},
{
 id:'bk_checklists',icon:'🧰',title:'Checklists de Diagnóstico',subtitle:'Roteiros rápidos para usar no campo',color:'linear-gradient(135deg,#714f1c,#b66b20)',sections:[
  {title:'1. Motor não parte',text:['Siga a cadeia abaixo sem pular etapas.'],check:['Existe pedido de partida?','Permissivos OK?','Intertravamentos OK?','Saída do CLP ativa?','Drive/contator recebe comando?','Motor recebe energia?','Feedback retorna?'],tip:'Pare no primeiro ponto onde o comportamento esperado deixa de acontecer.'},
  {title:'2. Motor parte e desliga',text:['Procure o primeiro sinal que muda após a partida.'],check:['Timer de feedback','Proteção','Permissivo','Falha do drive','Intertravamento de processo','Emergência'],tip:'Use trend quando a falha acontece rápido demais para observar manualmente.'},
  {title:'3. FactoryTalk com X',text:['Diagnóstico da camada de comunicação.'],check:['Shortcut','CLP online','Tag correta','Escopo','Caminho','Versão'],tip:'Teste uma tag conhecida antes de mexer no objeto.'},
  {title:'4. Botão não atua',text:['Separe o toque da lógica do CLP.'],check:['Botão escreve?','Tag muda?','CLP bloqueia?','Outra rotina sobrescreve?','Feedback muda?'],tip:'Se a tag de comando muda e volta imediatamente, abra Cross Reference.'},
  {title:'5. Inversor não roda',text:['Ready não significa que recebeu Run válido.'],check:['Ready','Fonte de comando','Run','Referência','Permissivos','Fault','Motor'],tip:'Confirme de onde o drive está esperando comando.'},
  {title:'6. Comunicação intermitente',text:['Intermitência exige registro.'],check:['Link físico','IP duplicado','Switch','Cabo','Alimentação','Timestamp','Carga de rede'],tip:'Mude uma variável por vez para não perder a causa.'},
  {title:'7. Antes de Download',text:['Proteja o processo e o projeto.'],check:['Controlador correto','Backup','Versão/firmware','Comparação','Impacto','Plano de retorno','Autorização'],tip:'Um download é uma ação de alto impacto; não trate como clique de rotina.'},
  {title:'8. Antes de alterar PanelView',text:['Garanta que você consiga voltar.'],check:['Modelo','Versão','Projeto fonte','MER','Backup','Comunicação','Arquivo com data'],tip:'Não altere a única cópia do projeto.'},
  {title:'9. Depois da correção',text:['Feche o ciclo de manutenção.'],check:['Teste funcional','Teste falha','Teste retorno','Registre causa','Registre alteração','Salve backup novo'],tip:'Correção sem teste de falha pode esconder um problema novo.'},
  {title:'10. Regra geral',text:['Diagnóstico profissional é método, não adivinhação.'],check:['Observe','Meça','Compare','Isole','Corrija','Teste','Documente'],tip:'Quanto melhor a documentação, mais rápida a próxima manutenção.'}
 ]
}
];