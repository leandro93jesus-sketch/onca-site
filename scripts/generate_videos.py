from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import subprocess,wave,contextlib

OUT=Path("app/src/main/assets/videos"); TMP=Path("/tmp/megacurso_video_tmp")
OUT.mkdir(parents=True,exist_ok=True); TMP.mkdir(parents=True,exist_ok=True)
W,H=720,1280; BG=(7,17,31); PANEL=(16,38,68); ACC=(77,163,255); ACC2=(32,201,151); TXT=(242,247,255); MUT=(180,197,221)
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; FONTB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def ft(n,b=False): return ImageFont.truetype(FONTB if b else FONT,n)
def wrap(d,t,font,w):
    out=[]; cur=""
    for x in t.split():
        q=(cur+" "+x).strip()
        if d.textbbox((0,0),q,font=font)[2]<=w: cur=q
        else:
            if cur: out.append(cur)
            cur=x
    if cur: out.append(cur)
    return out
def draw_slide(path,kicker,title,bullets,diagram=None):
    im=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(im)
    d.rounded_rectangle((36,42,W-36,116),22,fill=PANEL); d.text((60,62),kicker,font=ft(28,1),fill=TXT)
    y=155
    for ln in wrap(d,title,ft(48,1),W-96): d.text((48,y),ln,font=ft(48,1),fill=TXT); y+=58
    y+=16
    if diagram:
        bw=(W-96-(len(diagram)-1)*16)//len(diagram); x=48
        for i,label in enumerate(diagram):
            d.rounded_rectangle((x,y,x+bw,y+90),18,fill=PANEL,outline=ACC,width=2)
            ty=y+18
            for ln in wrap(d,label,ft(22,1),bw-20)[:2]: d.text((x+10,ty),ln,font=ft(22,1),fill=TXT); ty+=28
            if i<len(diagram)-1:
                d.line((x+bw+3,y+45,x+bw+13,y+45),fill=ACC2,width=5)
            x+=bw+16
        y+=120
    for b in bullets:
        d.ellipse((50,y+10,66,y+26),fill=ACC); ly=y
        for ln in wrap(d,b,ft(29),W-120): d.text((82,ly),ln,font=ft(29),fill=TXT); ly+=40
        y=ly+22
    d.line((48,H-100,W-48,H-100),fill=(100,125,160),width=2)
    d.text((48,H-75),"Mega Curso • Rockwell • FactoryTalk • WEG",font=ft(20),fill=MUT)
    im.save(path,quality=92)
def audio(text,path):
    subprocess.run(["espeak","-v","pt-br","-s","150","-p","43","-a","175","-w",str(path),text],check=True)
def dur(path):
    with contextlib.closing(wave.open(str(path),"r")) as w:return w.getnframes()/w.getframerate()
def clip(img,wav,out):
    subprocess.run(["ffmpeg","-y","-loglevel","error","-loop","1","-i",str(img),"-i",str(wav),"-t",str(dur(wav)+.35),"-vf","scale=720:1280,format=yuv420p","-c:v","libx264","-preset","veryfast","-crf","29","-r","24","-c:a","aac","-b:a","64k","-shortest",str(out)],check=True)
def build(slug,kicker,sections):
    parts=[]
    for i,s in enumerate(sections,1):
        img=TMP/f"{slug}_{i}.jpg"; wav=TMP/f"{slug}_{i}.wav"; mp=TMP/f"{slug}_{i}.mp4"
        draw_slide(img,kicker,s[0],s[1],s[3] if len(s)>3 else None); audio(s[2],wav); clip(img,wav,mp); parts.append(mp)
    lst=TMP/f"{slug}.txt"; lst.write_text("\n".join("file '"+str(x)+"'" for x in parts))
    subprocess.run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(lst),"-c","copy",str(OUT/f"{slug}.mp4")],check=True)

V={
"v01_studio5000":("Studio 5000 • Aula prática",[
("Como diagnosticar sem sair alterando lógica",["Comece pelo comando.","Depois permissivos e intertravamentos.","Só então vá para saída, drive e feedback."],"Nesta aula, use um método simples de manutenção. Primeiro confirme o comando. Depois veja permissivos e intertravamentos. Em seguida confira a saída do CLP, o inversor ou contator e, por fim, o feedback. Alterar lógica antes de localizar o ponto da falha aumenta o risco.",["Comando","Lógica","Saída","Feedback"]),
("Cross Reference: seu atalho para achar a causa",["Procure onde a tag é escrita.","Compare as rotinas.","Veja quem sobrescreve o valor."],"Quando uma tag muda sozinha ou um comando não permanece, abra o Cross Reference. O mais importante é localizar os pontos que escrevem naquela tag. Compare as rotinas e veja se uma lógica posterior está sobrescrevendo o valor.")]),
"v02_ft_me_se":("FactoryTalk • Aula 01",[
("FactoryTalk View ME ou SE?",["ME: máquina e PanelView.","SE: supervisório de planta.","Os conceitos são parecidos, a arquitetura não."],"FactoryTalk View ME é muito usado em aplicações de máquina e PanelView. O FactoryTalk View SE é usado em supervisórios maiores, com clientes e servidores. Os dois compartilham conceitos, mas a arquitetura e a forma de publicar a aplicação são diferentes."),
("Antes de editar, descubra três coisas",["Qual é a versão?","O projeto é ME ou SE?","Qual controlador e shortcut estão sendo usados?"],"Antes de mexer, descubra a versão do FactoryTalk, se o projeto é ME ou SE, e qual controlador está associado ao atalho de comunicação. Isso evita abrir o projeto na versão errada e evita alterar o caminho de comunicação sem necessidade.")]),
"v03_ft_linx":("FactoryTalk • Aula 02",[
("FactoryTalk Linx: faça a IHM enxergar o CLP",["Shortcut aponta para o controlador.","Teste uma tag simples primeiro.","X na tela costuma indicar referência inválida."],"O FactoryTalk Linx é a ponte entre a tela e o controlador. O shortcut é o nome lógico usado pela aplicação para apontar ao CLP. Antes de montar dezenas de objetos, teste uma tag booleana simples e confirme que leitura e escrita funcionam.",["Tela","Linx","CLP"]),
("Objeto com X: cheque nesta ordem",["Shortcut correto.","Controlador online.","Nome e escopo da tag.","Caminho de comunicação."],"Se um objeto aparece com X, não apague o objeto. Primeiro confira o shortcut. Depois confirme se o controlador está online. Em seguida verifique o nome e o escopo da tag e o caminho configurado no FactoryTalk Linx.")]),
"v04_ft_botoes":("FactoryTalk • Aula 03",[
("Momentary, Maintained, Set e Reset",["Momentary atua enquanto pressionado.","Maintained mantém estado.","Set e Reset separam os comandos."],"Escolher o tipo certo de botão evita comportamento estranho. O botão momentâneo atua enquanto está pressionado. O maintained mantém o estado. Set e Reset usam comandos separados e são úteis quando a lógica do CLP confirma o estado."),
("Regra de ouro: comando não é indicação",["Escreva uma tag de comando.","Anime pela tag confirmada do CLP.","Mostre bloqueio quando houver permissivo falso."],"Nunca use somente o mesmo bit do botão para dizer que a máquina mudou de estado. Escreva a tag de comando, mas anime o botão e o equipamento usando o estado confirmado pelo CLP. Assim a tela não mente para o operador.")]),
"v05_ft_alarmes":("FactoryTalk • Aula 04",[
("Alarme bom explica o problema",["Equipamento + condição.","Evite mensagens genéricas.","Registre hora e retorno ao normal."],"Um alarme útil deve dizer qual equipamento e qual condição aconteceu. Em vez de apenas falha M zero um, prefira uma mensagem como M zero um, comando presente sem feedback. A hora e a sequência dos alarmes ajudam a encontrar a causa."),
("Na manutenção, procure o primeiro evento",["Ordene pelo horário.","Compare com trend.","Separe causa de consequência."],"Quando vários alarmes aparecem juntos, procure o primeiro evento no tempo. Depois compare com tendências de corrente, pressão, velocidade e estados. Muitas vezes os últimos alarmes são apenas consequências da primeira falha.")]),
"v06_ft_trends":("FactoryTalk • Aula 05",[
("Trend transforma defeito intermitente em evidência",["Corrente.","Pressão.","Velocidade.","Falhas e permissivos."],"Trend é uma das melhores ferramentas para defeitos que aparecem e somem. Coloque grandezas como corrente, pressão e velocidade junto com bits importantes, como falha e permissivo. Assim você consegue ver qual sinal mudou primeiro."),
("Escolha a amostragem certa",["Muito lenta perde evento.","Muito rápida gera dado demais.","Use a dinâmica do processo como referência."],"A taxa de amostragem precisa combinar com o processo. Se for lenta demais, você perde o evento. Se for rápida demais, cria dados sem necessidade. Para sinais de manutenção, comece simples e ajuste depois de observar o comportamento.")]),
"v07_ft_global":("FactoryTalk • Aula 06",[
("Global Objects: pare de copiar tela por tela",["Crie um objeto genérico.","Passe parâmetros.","Reutilize para M01, M02, M03..."],"Se você tem muitos motores, não copie e edite o mesmo desenho dezenas de vezes. Crie um Global Object com parâmetros. Depois use o mesmo objeto para M zero um, M zero dois e assim por diante. Isso reduz erro e deixa o projeto mais fácil de manter."),
("Faceplate que ajuda manutenção",["Comando e estado.","Permissivos.","Falha.","Corrente e velocidade."],"Um bom faceplate não serve só para ligar e desligar. Ele deve mostrar estado, permissivos, falha, corrente e velocidade. Se possível, destaque o primeiro permissivo falso. Isso evita abrir o Studio 5000 para problemas simples.")]),
"v08_ft_mer":("FactoryTalk • Aula 07",[
("MER, backup e restore sem susto",["Identifique a versão.","Guarde projeto fonte e Runtime.","Nomeie arquivos com data e versão."],"Antes de alterar um PanelView, faça backup. Identifique a versão do FactoryTalk e guarde tanto o projeto fonte quanto o Runtime MER. Use nomes com data e versão para saber exatamente qual arquivo estava rodando."),
("Runtime não substitui o projeto fonte",["MER é o arquivo de execução.","Projeto de desenvolvimento é essencial.","Teste restauração em laboratório quando possível."],"O arquivo MER é o Runtime usado pela aplicação, mas ele não deve ser seu único backup. Guarde o projeto de desenvolvimento e documente a versão. Quando possível, teste a restauração em ambiente de laboratório.")]),
"v09_ft_permissivos":("FactoryTalk • Aula 08",[
("Tela de permissivos: diga por que não parte",["Liste as condições.","Mostre OK e bloqueado.","Destaque o primeiro falso."],"Uma tela de permissivos é uma ferramenta de manutenção. Liste as condições necessárias para a partida, mostre quais estão ok e destaque o primeiro permissivo falso. Isso reduz muito o tempo para descobrir por que um motor ou uma rota não parte."),
("Use texto, não só cor",["Verde e vermelho ajudam.","Texto explica.","Ícone reforça a informação."],"Cor ajuda, mas não deve ser a única informação. Mostre texto como ok, bloqueado, falha ou sem comunicação. Use ícones e descrições para que operador e manutenção entendam rapidamente o que está acontecendo.")]),
"v10_weg_cfw500":("WEG • Integração",[
("CFW500 + CLP + FactoryTalk",["Comando Run.","Ready, Run e Fault.","Referência e Hz atual.","Corrente e código de falha."],"Na integração do CFW quinhentos com CLP e FactoryTalk, separe comando e retorno. O CLP envia Run e referência. O inversor devolve Ready, Run, Fault, frequência atual e corrente. A tela deve mostrar também o estado de comunicação.",["FactoryTalk","CLP","CFW500","Motor"]),
("Não resete sem descobrir a causa",["Leia a falha.","Anote condição.","Confira corrente e carga.","Depois faça o reset autorizado."],"Evite resetar o inversor várias vezes sem entender a falha. Leia o código, anote em que condição ocorreu, verifique corrente, carga e comando. Depois de entender a causa, faça o reset conforme o procedimento da instalação.")])
}
for slug,(kicker,sections) in V.items(): build(slug,kicker,sections)