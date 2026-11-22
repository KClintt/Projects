'use strict';

function createRoomArt(g) {
  function rect(x,y,w,h,color) {g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);}
  function shape(color,...points) {
    g.fillStyle=color;g.beginPath();g.moveTo(...points[0]);
    for(const point of points.slice(1))g.lineTo(...point);
    g.closePath();g.fill();
  }
  function oval(x,y,rx,ry,color) {
    g.fillStyle=color;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();
  }
  function line(color,weight,...points) {
    g.strokeStyle=color;g.lineWidth=weight;g.lineCap='round';g.beginPath();g.moveTo(...points[0]);
    for(const point of points.slice(1))g.lineTo(...point);
    g.stroke();
  }
  function gradient(x,y,x2,y2,a,b) {
    const fill=g.createLinearGradient(x,y,x2,y2);
    fill.addColorStop(0,a);fill.addColorStop(1,b);return fill;
  }
  function floor(wall,base,wood,seam) {
    rect(0,0,720,400,wall);rect(0,211,720,189,wood);
    rect(0,207,720,9,base);
    for(const y of [228,255,293,343,397])line(seam,1,[0,y],[720,y]);
    for(let x=-240;x<1000;x+=84)line(seam,1,[360+(x-360)*.65,214],[x,400]);
  }
  function windowArt(x,y,w,h,night,t) {
    rect(x-8,y-8,w+16,h+17,night?'#252c3b':'#78463e');
    g.save();g.beginPath();g.rect(x,y,w,h);g.clip();
    rect(x,y,w,h,night?gradient(x,y,x,y+h,'#24354f','#526685'):gradient(x,y,x,y+h,'#be746b','#ffcb8b'));
    oval(x+w*.68,y+h*.37,night?10:21,night?10:21,night?'#d7dce4':'#ffdd96');
    for(let i=0;i<10;i++){
      const top=y+h*.73+(i*13%31);
      rect(x+i*w/10,top,w/10+1,h,night?'#30405a':'#996368');
      if(night)rect(x+i*w/10+4,top+7,3,3,i%3?'#c7a87d':'#6c8397');
    }
    if(night)for(let i=0;i<35;i++){
      const xx=x+(i*47%w), yy=y+(i*31+t*49)%h;
      line('#c2d7e354',1,[xx,yy],[xx-4,yy+13]);
    }
    g.restore();
    rect(x+w/2-2,y,4,h,night?'#313747':'#875a50');
    rect(x-10,y+h,w+20,6,night?'#586373':'#aa7460');
  }
  function plant(x,y,s=1) {
    g.save();g.translate(x,y);g.scale(s,s);
    line('#526348',3,[0,0],[1,-48]);line('#526348',2,[1,-18],[-12,-35]);
    oval(-12,-36,10,5,'#788466');oval(9,-42,10,5,'#8d956b');oval(-5,-52,7,5,'#a4a477');
    shape('#b66955',[-15,-4],[15,-4],[10,17],[-10,17]);
    rect(-16,-5,32,5,'#db9570');g.restore();
  }
  function chair(x,y,col='#9b5847') {
    line('#483038',5,[x-25,y],[x-28,y+61]);line('#483038',5,[x+25,y],[x+28,y+61]);
    rect(x-28,y-2,56,35,col);rect(x-22,y+7,44,14,'#412c3566');
    shape('#ad7056',[x-27,y+35],[x+27,y+35],[x+34,y+48],[x-35,y+48]);
    rect(x-35,y+48,69,5,'#593b38');
  }
  function person(x,y,{shirt,skin,hair,silly=false,reach=false,bob=0,size=1,style=0}) {
    g.save();g.translate(Math.round(x),Math.round(y+bob));g.scale(size,size);
    oval(0,63,21,5,'#32253055');
    line('#443544',10,[-8,34],[-10,56],[-16,60]);line('#443544',10,[8,34],[11,54],[17,58]);
    shape(shirt,[-13,1],[13,1],[18,11],[15,39],[-16,39],[-18,12]);
    line(shirt,8,[-12,9],[-21,23],[-24,reach?2:27]);line(skin,6,[-23,reach?0:26],[-25,reach?-8:30]);
    line(shirt,8,[13,9],[22,21],[25,silly?1:26]);line(skin,6,[24,silly?0:25],[25,silly?-7:29]);
    rect(-4,-4,8,9,skin);
    oval(0,-16,18,18,hair);
    oval(-14,-13,5,6,skin);oval(14,-13,5,6,skin);oval(0,-14,15,16,skin);
    if(style===1){
      for(let i=0;i<7;i++)oval(-15+i*5,-25-(i%3),6,7,hair);
    }else{
      shape(hair,[-17,-15],[-18,-25],[-10,-34],[7,-35],[17,-27],[16,-20],[1,-24],[-8,-19],[-13,-15]);
      if(style===2)oval(12,-31,7,9,hair);
    }
    rect(-7,-17,3,3,'#352831');rect(5,-17,3,silly?1:3,'#352831');
    if(silly){oval(1,-8,6,4,'#512e36');oval(3,-5,3,3,'#e18484');}
    else shape('#633844',[-5,-9],[6,-9],[3,-5],[-2,-5]);
    rect(-12,-11,4,2,'#af525445');rect(9,-11,4,2,'#af525445');
    g.restore();
  }
  const family = [
    {shirt:'#43867d',skin:'#bd7956',hair:'#342735',style:1},
    {shirt:'#d08553',skin:'#e2a575',hair:'#53313c',style:2},
    {shirt:'#9c667d',skin:'#8f523f',hair:'#2f2632',style:1},
    {shirt:'#c45f59',skin:'#cd8a62',hair:'#412f38'},
    {shirt:'#be9b5a',skin:'#a9694d',hair:'#3e2a33',style:2}
  ];
  function dish(x,y,food) {
    oval(x,y,15,6,'#56353350');oval(x,y-2,14,5,'#f4dbc0');oval(x,y-3,8,3,food);
  }
  function albumArt(x,y) {
    shape('#241f2d',[x-2,y+8],[x+52,y+5],[x+63,y+19],[x+10,y+23]);
    shape('#dfc6a0',[x,y+4],[x+51,y+1],[x+61,y+15],[x+10,y+20]);
    shape('#92584c',[x-1,y],[x+50,y-3],[x+61,y+12],[x+9,y+16]);
    shape('#dbad75',[x+18,y+3],[x+35,y+1],[x+39,y+7],[x+22,y+9]);
    line('#6f413d',2,[x+4,y+1],[x+14,y+15]);
  }
  function childhood(t) {
    floor(gradient(0,0,0,218,'#ba806c','#dca183'),'#986158','#b47c58','#875c4e');
    windowArt(37,34,167,125,false,t);
    shape('#ffdb913b',[58,161],[193,161],[374,400],[117,400]);
    rect(23,23,192,5,'#5b3e44');
    shape('#844e57',[28,28],[53,28],[44,127],[53,166],[25,180]);
    shape('#a85e61',[190,28],[211,28],[215,171],[188,162],[198,119]);
    line('#74494a',2,[227,48],[285,61],[346,64],[402,60],[472,40]);
    ['#e8b86c','#808b76','#be7266','#e4ae79','#9a566a'].forEach((c,i)=>{
      const x=233+i*48,y=[50,59,64,62,51][i];shape(c,[x,y],[x+23,y+4],[x+12,y+24]);
    });
    rect(525,40,163,89,'#79524c');rect(530,45,153,80,'#c59172');
    for(const x of [537,587,637]) {
      rect(x,52,43,66,'#ad745e');rect(x+4,56,35,56,'#b98166');rect(x+28,84,4,10,'#714a48');
    }
    rect(513,157,194,57,'#7b5b59');rect(511,151,200,9,'#e2b693');
    for(let i=0;i<5;i++){rect(520+i*37,165,34,43,'#886963');rect(529+i*37,171,15,2,'#4b4147');}
    rect(646,136,32,15,'#d3a883');oval(662,136,15,4,'#f2d1a2');rect(651,131,22,3,'#e5c29a');
    const bob=(i)=>Math.round(Math.sin(t*2.3+i)*2);
    person(567,124,{...family[4],reach:true,bob:bob(0),size:.94});
    person(603,127,{...family[0],silly:true,bob:bob(3),size:.89});
    if(Math.sin(t*2)>-.4) {
      line('#ffe5b5',2,[617,97],[624,91]);line('#ffe5b5',2,[625,106],[634,105]);
    }
    oval(368,324,113,31,'#794c4b');oval(368,324,104,26,'#c18c68');oval(368,324,86,18,'#985b58');
    rect(279,174,221,57,'#764748');rect(288,182,203,46,'#a2625b');
    rect(270,211,238,30,'#874f50');rect(283,214,212,15,'#c98171');
    oval(281,207,12,21,'#a76c60');oval(497,208,12,21,'#a76c60');
    rect(316,189,33,23,'#d8a574');rect(356,189,34,22,'#d5a777');
    const groupMove=Math.round(Math.sin(t*4)*6);
    g.save();g.filter='blur(1.15px)';
    person(404+groupMove,133,{...family[3],bob:bob(3),size:.9,reach:true});
    person(440+groupMove,130,{...family[2],bob:bob(1),size:1.01});
    person(473+groupMove,138,{...family[1],silly:true,bob:bob(6),size:.88});
    g.restore();
    person(354,275,{...family[0],silly:true,reach:true,bob:bob(2),size:1.11});
    line('#efd18d',2,[323,242],[316,235]);line('#efd18d',2,[380,242],[387,236]);
    oval(143,299,112,24,'#6d45475c');
    chair(88,213);chair(180,203);
    person(98,196,{...family[2],bob:bob(0)});
    person(147,197,{...family[1],bob:bob(4)});
    person(205,210,{...family[4],bob:bob(1),size:.9});
    line('#623e39',10,[62,247],[52,297]);line('#623e39',10,[221,249],[228,298]);
    oval(143,245,106,23,'#79463d');oval(143,238,106,24,'#d29967');
    dish(86,239,'#916e4d');dish(127,227,'#ac5b49');dish(166,244,'#8b8e58');dish(205,232,'#bd744f');
    rect(140,224,8,11,'#a7554f');rect(184,233,8,11,'#995d50');
    rect(135,248,19,4,'#eed2ab');
    oval(615,346,67,10,'#69484665');chair(620,253,'#a9614d');
    plant(690,243,1.16);
    rect(5,173,29,42,'#704a48');plant(19,174,.75);
  }
  function later(t,adult,unpacking) {
    floor(gradient(0,0,0,213,adult?'#313d50':'#5d475f',adult?'#4a5670':'#947287'),adult?'#374050':'#574559',adult?'#555364':'#725768',adult?'#414450':'#604758');
    windowArt(adult?428:64,33,adult?211:165,133,adult,t);
    if(adult){
      shape('#83a3bc1c',[426,167],[643,167],[704,400],[343,400]);
      rect(1,151,142,65,'#3b4253');rect(10,160,125,46,'#303647');
      for(let i=0;i<8;i++)rect(17+i*13,171+(i%3)*6,10,35-(i%3)*6,['#765966','#a88a73','#576a77'][i%3]);
      rect(170,199,235,11,'#9f765f');rect(180,210,14,89,'#58444c');rect(384,210,13,89,'#58444c');
      shape('#f4b96d32',[225,134],[275,134],[376,199],[175,199]);
      line('#cc9b71',5,[266,126],[286,157],[278,194]);oval(277,197,21,4,'#735648');
      shape('#d09c6d',[237,112],[258,104],[281,133],[220,133]);
      oval(251,134,31,4,'#ffe0a1');
      plant(624,161,.72);
      rect(617,230,103,64,'#434353');rect(607,221,113,12,'#6e6571');
      rect(653,196,43,25,'#9c7f7d');rect(650,194,48,5,'#be9a8b');
      oval(446,333,173,42,'#3d3f5266');oval(446,328,150,35,'#616579');
      for(const y of [316,323,330,337,344])line('#8c8d9b55',1,[357,y],[536,y]);
      if(unpacking){
        rect(290,267,108,64,'#886c61');shape('#9f8371',[283,250],[371,248],[404,270],[289,272]);
        rect(333,271,19,60,'#b99a7c');albumArt(299,247);
        rect(77,247,101,57,'#947561');rect(116,247,16,57,'#b29676');rect(75,244,108,7,'#ab8870');
      }else{
        albumArt(300,179);rect(359,180,13,20,'#aa8a82');oval(365,180,7,2,'#dab8a0');
      }
      chair(527,236,'#676276');
    }else{
      shape('#ffc69428',[65,165],[220,165],[407,399],[151,399]);
      rect(295,76,174,8,'#513a54');rect(295,133,174,8,'#513a54');
      albumArt(367,112);
      for(let i=0;i<6;i++)rect(306+i*10,109-(i%3)*4,8,24+(i%3)*4,['#d6aa83','#a76d7b','#787f8c'][i%3]);
      rect(298,70,13,6,'#ad7b72');plant(405,60,.74);
      rect(501,155,207,81,'#624758');rect(499,152,215,17,'#a68188');
      rect(490,178,230,46,'#a5788c');rect(583,177,137,47,'#795e85');
      for(let i=0;i<6;i++)rect(583+i*23,182,2,39,'#927797');
      rect(526,170,48,17,'#d8afb0');
      rect(60,181,164,13,'#9a6e69');rect(66,194,10,75,'#664759');rect(204,194,10,75,'#664759');
      rect(99,170,48,9,'#c3a0a6');rect(104,165,45,5,'#805e77');
      oval(310,326,134,35,'#634d6366');oval(310,321,122,33,'#906f87');
      line('#b88fa0',2,[220,315],[397,315]);line('#b88fa0',2,[214,326],[407,326]);
      rect(181,270,44,46,'#445466');oval(203,270,22,14,'#556e82');rect(187,290,32,19,'#6d8794');rect(189,298,28,2,'#364b62');
      rect(548,67,68,53,'#72516a');rect(552,71,60,45,'#d19d90');shape('#8d7188',[554,104],[576,79],[587,98],[596,86],[611,105],[611,115],[554,115]);
    }
  }

  return {childhood, later};
}
