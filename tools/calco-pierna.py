def cr(pts, closed=True):
    # Catmull-Rom -> cubic bezier path
    P = pts + pts[:3] if closed else [pts[0]]+pts+[pts[-1]]
    n = len(pts) if closed else len(pts)-1
    d = f"M{P[1][0] if not closed else P[0][0]} {P[1][1] if not closed else P[0][1]}"
    off = 0 if closed else 0
    seq = P if not closed else [pts[-1]]+pts+pts[:2]
    d = f"M{seq[1][0]} {seq[1][1]}"
    for i in range(1, len(seq)-2):
        p0,p1,p2,p3 = seq[i-1],seq[i],seq[i+1],seq[i+2]
        c1=(p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6)
        c2=(p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6)
        d+=f" C{c1[0]:.0f} {c1[1]:.0f} {c2[0]:.0f} {c2[1]:.0f} {p2[0]} {p2[1]}"
    return d+(" Z" if closed else "")
OUT="#14213A"
def shape(pts, fill, sw=9, closed=True):
    return f'<path d="{cr(pts,closed)}" fill="{fill}" stroke="{OUT}" stroke-width="{sw}" stroke-linejoin="round"/>'
def escena(mal):
    s=['<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500">']
    # roca clara estilo cuenta
    s.append('<rect width="1000" height="1500" fill="#E9E1D2"/>')
    for pts,c in [([(0,0),(380,0),(300,260),(120,420),(0,470)],"#DED4C2"),([(560,760),(900,680),(1000,900),(1000,1500),(700,1500),(640,1100)],"#DCD1BE"),([(0,900),(300,860),(420,1200),(250,1500),(0,1500)],"#E2D9C8")]:
        s.append(f'<path d="{cr(pts)}" fill="{c}"/>')
    # grieta principal (como en la ref) y fisuras
    s.append(f'<path d="{cr([(500,40),(540,220),(600,420),(660,620),(700,820),(730,1050),(760,1300),(780,1500)],False)}" stroke="#7D705C" stroke-width="16" fill="none" stroke-linecap="round"/>')
    for pts in [[(80,700),(260,760),(380,740)],[(820,420),(900,470),(1000,450)],[(150,1100),(300,1180)],[(820,1000),(920,1060)]]:
        s.append(f'<path d="{cr(pts,False)}" stroke="#A89A82" stroke-width="7" fill="none" stroke-linecap="round"/>')
    # presas: pie izq y pie dcho
    s.append(shape([(20,540),(130,520),(170,560),(60,585)],"#FF6F91",8))
    s.append(shape([(600,735),(720,715),(760,750),(640,775)],"#3CC9B0",8))
    # chapa + cinta (abajo, en la grieta)
    s.append('<circle cx="745" cy="1080" r="20" fill="#B8C0CA" stroke="#14213A" stroke-width="7"/>')
    s.append(f'<path d="{cr([(745,1080),(735,1120),(748,1160)],False)}" stroke="#B8C0CA" stroke-width="14" fill="none"/>')
    s.append('<rect x="728" y="1150" width="40" height="95" rx="14" fill="#9B7BEA" stroke="#14213A" stroke-width="7"/>')
    s.append(f'<path d="M748 1240 q-36 25 -8 75 q30 25 44 -8 q8 -45 -36 -67" stroke="#B8C0CA" stroke-width="13" fill="none"/>')
    clip=(752,1300)
    rope_col="#FF7A1A"
    def rope(pts, shadow):
        d=cr(pts,False); r=''
        if shadow: r+=f'<path d="{d}" stroke="#000" stroke-opacity=".18" stroke-width="26" fill="none" transform="translate({shadow} {shadow})" stroke-linecap="round"/>'
        r+=f'<path d="{d}" stroke="{OUT}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="{d}" stroke="{rope_col}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="{d}" stroke="#FFD2A6" stroke-width="5" fill="none" stroke-dasharray="12 16" stroke-linecap="round"/>'
        return r
    # sombras de las piernas sobre la roca (dan profundidad)
    sh='<g opacity=".16" transform="translate(34 26)">'
    sh+=f'<path d="{cr([(330,0),(600,0),(540,90),(300,280),(200,330),(130,400),(90,540),(10,520),(60,380),(160,240)])}" fill="#000"/>'
    sh+=f'<path d="{cr([(660,0),(880,0),(780,220),(700,470),(680,640),(540,720),(560,470),(610,250)])}" fill="#000"/></g>'
    s.append(sh)
    pant="#24324F"; pant2="#33456B"; skin="#EDBE97"; shoe="#2F6FD0"
    def piernas():
        g=''
        # pierna izquierda: pantalón, vuelta, gemelo, pie
        g+=shape([(330,-20),(610,-20),(560,70),(430,160),(290,280),(250,300),(165,255),(230,180)],pant)
        g+=f'<path d="{cr([(470,40),(380,150),(280,230)],False)}" stroke="{pant2}" stroke-width="22" fill="none" stroke-linecap="round"/>'
        g+=shape([(150,250),(260,300),(240,345),(130,300)],pant2,8)
        g+=shape([(150,305),(235,345),(185,420),(130,470),(80,455),(110,380)],skin)
        g+=shape([(70,440),(140,460),(160,520),(100,560),(10,560),(0,520),(30,470)],shoe)
        g+=f'<path d="M30 548 L150 535" stroke="#14213A" stroke-width="16" stroke-linecap="round"/><path d="M60 480 q30 10 55 0" stroke="#FFC93C" stroke-width="9" fill="none" stroke-linecap="round"/>'
        # pierna derecha
        g+=shape([(650,-20),(885,-20),(820,160),(740,290),(715,450),(600,455),(615,300),(640,140)],pant)
        g+=f'<path d="{cr([(800,60),(735,220),(690,380)],False)}" stroke="{pant2}" stroke-width="22" fill="none" stroke-linecap="round"/>'
        g+=shape([(590,430),(725,440),(720,490),(585,480)],pant2,8)
        g+=shape([(595,480),(715,490),(690,560),(665,620),(590,625),(575,560)],skin)
        g+=shape([(570,600),(675,605),(740,690),(745,730),(640,745),(555,735),(540,660)],shoe)
        g+=f'<path d="M555 735 L740 728" stroke="#14213A" stroke-width="16" stroke-linecap="round"/><path d="M600 640 q40 12 75 2" stroke="#FFC93C" stroke-width="9" fill="none" stroke-linecap="round"/>'
        return g
    if mal:
        # ✕: la cuerda baja por el exterior y cruza POR DELANTE del gemelo derecho (la pierna queda entre cuerda y roca)
        ropepts=[(880,-20),(860,200),(800,380),(700,520),(620,560),(600,620),(660,800),(720,1000),clip]
        s += [piernas(), rope(ropepts, 30)]
        s.append('<circle cx="655" cy="560" r="120" fill="none" stroke="#F04E4E" stroke-width="13" stroke-dasharray="26 16"/>')
    else:
        # ✓: la cuerda baja entre las piernas, pegada a la roca, POR DETRÁS del pie
        ropepts=[(520,-20),(515,200),(520,420),(560,640),(650,820),(720,1000),clip]
        s += [rope(ropepts, 8), piernas()]
    s.append('</svg>')
    return "".join(s)
open('/tmp/calco/mal.svg','w').write(escena(True)); open('/tmp/calco/bien.svg','w').write(escena(False))
