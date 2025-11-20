"use client";

import React from "react";

const MRT_SVG = `
<svg version="1.1" width="100%" height="100%" viewBox="0 0 1369.9617919921875 1104.26025390625">
 <g fill="none" stroke-width="10">
  <path d="m 449.7109 103.2889 v -49.999998" stroke="#f98e99"></path>
  <path d="m 664.7109 1023.2889 h -45" stroke="#cce226"></path>
  <path d="m 1069.7109 553.2889 h -605 c -17.59453 0 -40 22.40547 -40 40 v 125 c 0 14.26086 15.73915 30 30 30 h 85 l 110 110 c 7.35863 7.35863 15 18.39002 15 25 v 220" stroke="#007c59"></path>
  <path d="m 59.710902 103.2889 h 405 c 75 0 75 0 75 75 v 570 h 525" stroke="#d12d33"></path>
  <path d="m 89.7109 943.2889 l 280 -280 c 15 -15 25 -15 55 -15 h 800" stroke="#0072c6"></path>
  <path d="m 1174.7109 943.2889 h -360.00008 c -34.28884 0 -59.99992 -40.71114 -59.99992 -75 v -445 c 0 -50 0 -50 55 -50 h 370 c 45 0 45 0 45 45 v 230" stroke="#aa753f"></path>
  <g stroke="#fca311">
   <path d="m 409.7109 983.28889 l 235 -234.99999 v -270 c 0 -20 -10 -30 -30 -30 h -180 l -365 365"></path>
   <path d="M 434.73522,447.69034 209.7109,223.2889"></path>
  </g>
 </g>
 <g font-family="Noto Sans CJK TC Regular" text-align="start" word-spacing="0" line-height="125%" letter-spacing="0" font-size="18">
  <text y="637.11798" x="433.18942" fill="#bbb"><tspan y="637.11798" x="433.18942" text-align="start" line-height="125%">西門</tspan>
  </text>
  <text y="550.8833" x="410.22095" fill="#bbb"><tspan y="550.8833" x="410.22095" text-align="start" line-height="125%">北門</tspan>
  </text>
  <text y="749.21527" x="369.95615" fill="#bbb"><tspan y="749.21527" x="369.95615" text-align="start" line-height="125%">小南門</tspan>
  </text>
  <text y="775.84534" x="451.32596" fill="#bbb"><tspan y="775.84534" x="451.32596" text-align="start" line-height="125%">中正紀念堂</tspan>
  </text>
  <text y="808.16486" x="536.74695" fill="#bbb"><tspan y="808.16486" x="536.74695" text-align="start" line-height="125%">古亭</tspan>
  </text>
  <text y="736.8255" x="600.24542" fill="#bbb"><tspan y="736.8255" x="600.24542" text-align="start" line-height="125%">東門</tspan>
  </text>
  <text y="705.44763" x="547.79901" fill="#bbb"><tspan y="705.44763" x="547.79901" text-align="start" line-height="125%">台大醫院</tspan>
  </text>
  <text y="736.00128" x="763.86212" fill="#bbb"><tspan y="736.00128" x="763.86212" text-align="start" line-height="125%">大安</tspan>
  </text>
  <text y="541.14478" x="547.97675" fill="#bbb"><tspan y="541.14478" x="547.97675" text-align="start" line-height="125%">中山</tspan>
  </text>
  <text y="505.39972" x="549.09277" fill="#bbb"><tspan y="505.39972" x="549.09277" text-align="start" line-height="125%">雙連</tspan>
  </text>
  <text y="436.69766" x="549.69098" fill="#bbb"><tspan y="436.69766" x="549.69098" text-align="start" line-height="125%">民權西路</tspan>
  </text>
  <text y="460.03207" x="649.84418" fill="#bbb"><tspan y="460.03207" x="649.84418" text-align="start" line-height="125%">中山國小</tspan>
  </text>
  <text y="505.16479" x="654.07062" fill="#bbb"><tspan y="505.16479" x="654.07062" text-align="start" line-height="125%">行天宮</tspan>
  </text>
  <text y="541.08911" x="653.99438" fill="#bbb"><tspan y="541.08911" x="653.99438" text-align="start" line-height="125%">松江南京</tspan>
  </text>
  <text y="671.07532" x="461.79898" fill="#bbb"><tspan y="671.07532" x="461.79898" text-align="start" line-height="125%">台北車站</tspan>
  </text>
  <text y="637.1424" x="651.51514" fill="#bbb"><tspan y="637.1424" x="651.51514" text-align="start" line-height="125%">忠孝新生</tspan>
  </text>
  <text y="637.06818" x="562.62433" fill="#bbb"><tspan y="637.06818" x="562.62433" text-align="start" line-height="125%">善導寺</tspan>
  </text>
  <text y="636.77814" x="760.10809" fill="#bbb"><tspan y="636.77814" x="760.10809" text-align="start" line-height="125%">忠孝復興</tspan>
  </text>
  <text y="541.06415" x="763.4458" fill="#bbb"><tspan y="541.06415" x="763.4458" text-align="start" line-height="125%">南京復興</tspan>
  </text>
  <text y="471.31891" x="437.06668" fill="#bbb"><tspan y="471.31891" x="437.06668" text-align="start" line-height="125%">大橋頭</tspan>
  </text>
  <text y="876.20984" x="665.88202" fill="#bbb"><tspan y="876.20984" x="665.88202" text-align="start" line-height="125%">公館</tspan>
  </text>
  <text y="840.13782" x="637.88348" fill="#bbb"><tspan y="840.13782" x="637.88348" text-align="start" line-height="125%">台電大樓</tspan>
  </text>
  <text y="950.12885" x="673.94354" fill="#bbb"><tspan y="950.12885" x="673.94354" text-align="start" line-height="125%">景美</tspan>
  </text>
  <text y="910.18872" x="673.67352" fill="#bbb"><tspan y="910.18872" x="673.67352" text-align="start" line-height="125%">萬隆</tspan>
  </text>
  <text y="1029.9038" x="673.83557" fill="#bbb"><tspan y="1029.9038" x="673.83557" text-align="start" line-height="125%">七張</tspan>
  </text>
  <text y="1030.1108" x="551.67468" fill="#bbb"><tspan y="1030.1108" x="551.67468" text-align="start" line-height="125%">小碧潭</tspan>
  </text>
  <text y="1110.1738" x="678.84503" fill="#bbb"><tspan y="1110.1738" x="678.84503" text-align="start" line-height="125%">新店</tspan>
  </text>
  <text y="1068.4447" x="673.94354" fill="#bbb"><tspan y="1068.4447" x="673.94354" text-align="start" line-height="125%">新店區公所</tspan>
  </text>
  <text y="990.13782" x="673.97955" fill="#bbb"><tspan y="990.13782" x="673.97955" text-align="start" line-height="125%">大坪林</tspan>
  </text>
  <text y="900.16486" x="413.50873" fill="#bbb"><tspan y="900.16486" x="413.50873" text-align="start" line-height="125%">永安市場</tspan>
  </text>
  <text y="855.05682" x="494.64236" fill="#bbb"><tspan y="855.05682" x="494.64236" text-align="start" line-height="125%">頂溪</tspan>
  </text>
  <text y="990.11078" x="343.09006" fill="#bbb"><tspan y="990.11078" x="343.09006" text-align="start" line-height="125%">南勢角</tspan>
  </text>
  <text y="945.16486" x="404.91272" fill="#bbb"><tspan y="945.16486" x="404.91272" text-align="start" line-height="125%">景安</tspan>
  </text>
  <text y="405.95996" x="551.93604" fill="#bbb"><tspan y="405.95996" x="551.93604" text-align="start" line-height="125%">圓山</tspan>
  </text>
  <text y="363.1741" x="551.82806" fill="#bbb"><tspan y="363.1741" x="551.82806" text-align="start" line-height="125%">劍潭</tspan>
  </text>
  <text y="140.11081" x="547.49506" fill="#bbb"><tspan y="140.11081" x="547.49506" text-align="start" line-height="125%">唭哩岸</tspan>
  </text>
  <text y="180.11981" x="551.86401" fill="#bbb"><tspan y="180.11981" x="551.86401" text-align="start" line-height="125%">石牌</tspan>
  </text>
  <text y="225.10181" x="550.19501" fill="#bbb"><tspan y="225.10181" x="550.19501" text-align="start" line-height="125%">明德</tspan>
  </text>
  <text y="270.16483" x="550.66296" fill="#bbb"><tspan y="270.16483" x="550.66296" text-align="start" line-height="125%">芝山</tspan>
  </text>
  <text y="315.14682" x="550.68097" fill="#bbb"><tspan y="315.14682" x="550.68097" text-align="start" line-height="125%">士林</tspan>
  </text>
  <text y="100.11081" x="516.71997" fill="#bbb"><tspan y="100.11081" x="516.71997" text-align="start" line-height="125%">奇岩</tspan>
  </text>
  <text y="90.15582" x="236.24303" fill="#bbb"><tspan y="90.15582" x="236.24303" text-align="start" line-height="125%">關渡</tspan>
  </text>
  <text y="90.14765" x="301.68402" fill="#bbb"><tspan y="90.14765" x="301.68402" text-align="start" line-height="125%">忠義</tspan>
  </text>
  <text y="90.11081" x="358.3382" fill="#bbb"><tspan y="90.11081" x="358.3382" text-align="start" line-height="125%">復興崗</tspan>
  </text>
  <text y="95.1018" x="456.77402" fill="#bbb"><tspan y="95.1018" x="456.77402" text-align="start" line-height="125%">北投</tspan>
  </text>
  <text y="90.12882" x="172.21501" fill="#bbb"><tspan y="90.12882" x="172.21501" text-align="start" line-height="125%">竹圍</tspan>
  </text>
  <text y="40.1558" x="422.68402" fill="#bbb"><tspan y="40.1558" x="422.68402" text-align="start" line-height="125%">新北投</tspan>
  </text>
  <text y="90.11699" x="41.612019" fill="#bbb"><tspan y="90.11699" x="41.612019" text-align="start" line-height="125%">淡水</tspan>
  </text>
  <text y="90.13556" x="97.61203" fill="#bbb"><tspan y="90.13556" x="97.61203" text-align="start" line-height="125%">紅樹林</tspan>
  </text>
  <text y="410.05682" x="403.44998" fill="#bbb"><tspan y="410.05682" x="403.44998" text-align="start" line-height="125%">三重國小</tspan>
  </text>
  <text y="365.11081" x="358.49182" fill="#bbb"><tspan y="365.11081" x="358.49182" text-align="start" line-height="125%">三和國中</tspan>
  </text>
  <text y="320.12881" x="314.29517" fill="#bbb"><tspan y="320.12881" x="314.29517" text-align="start" line-height="125%">徐匯中學</tspan>
  </text>
  <text y="275.11084" x="268.49182" fill="#bbb"><tspan y="275.11084" x="268.49182" text-align="start" line-height="125%">三民高中</tspan>
  </text>
  <text y="230.11981" x="224.07402" fill="#bbb"><tspan y="230.11981" x="224.07402" text-align="start" line-height="125%">蘆洲</tspan>
  </text>
  <text y="495.16479" x="326.33112" fill="#bbb"><tspan y="495.16479" x="326.33112" text-align="start" line-height="125%">台北橋</tspan>
  </text>
  <text y="535.16113" x="304.35358" fill="#bbb"><tspan y="535.16113" x="304.35358" text-align="start" line-height="125%">菜寮</tspan>
  </text>
  <text y="575.36279" x="264.65634" fill="#bbb"><tspan y="575.36279" x="264.65634" text-align="start" line-height="125%">三重</tspan>
  </text>
  <text y="615.13782" x="207.18687" fill="#bbb"><tspan y="615.13782" x="207.18687" text-align="start" line-height="125%">先嗇宮</tspan>
  </text>
  <text y="655.11084" x="166.55107" fill="#bbb"><tspan y="655.11084" x="166.55107" text-align="start" line-height="125%">頭前庄</tspan>
  </text>
  <text y="695.14679" x="144.5864" fill="#bbb"><tspan y="695.14679" x="144.5864" text-align="start" line-height="125%">新莊</tspan>
  </text>
  <text y="735.11981" x="104.49707" fill="#bbb"><tspan y="735.11981" x="104.49707" text-align="start" line-height="125%">輔大</tspan>
  </text>
  <text y="774.63385" x="64.24645" fill="#bbb"><tspan y="774.63385" x="64.24645" text-align="start" line-height="125%">丹鳳</tspan>
  </text>
  <text y="815.13782" x="24.370008" fill="#bbb"><tspan y="815.13782" x="24.370008" text-align="start" line-height="125%">迴龍</tspan>
  </text>
  <text y="670.13782" x="300.67969" fill="#bbb"><tspan y="670.13782" x="300.67969" text-align="start" line-height="125%">龍山寺</tspan>
  </text>
  <text y="699.99969" x="270.69897" fill="#bbb"><tspan y="699.99969" x="270.69897" text-align="start" line-height="125%">江子翠</tspan>
  </text>
  <text y="730.17999" x="258.45038" fill="#bbb"><tspan y="730.17999" x="258.45038" text-align="start" line-height="125%">新埔</tspan>
  </text>
  <text y="760.11981" x="228.29649" fill="#bbb"><tspan y="760.11981" x="228.29649" text-align="start" line-height="125%">板橋</tspan>
  </text>
  <text y="790.17383" x="199.54424" fill="#bbb"><tspan y="790.17383" x="199.54424" text-align="start" line-height="125%">府中</tspan>
  </text>
  <text y="850.16486" x="139.67754" fill="#bbb"><tspan y="850.16486" x="139.67754" text-align="start" line-height="125%">海山</tspan>
  </text>
  <text y="820.20081" x="132.34241" fill="#bbb"><tspan y="820.20081" x="132.34241" text-align="start" line-height="125%">亞東醫院</tspan>
  </text>
  <text y="880.10181" x="108.30154" fill="#bbb"><tspan y="880.10181" x="108.30154" text-align="start" line-height="125%">土城</tspan>
  </text>
  <text y="910.17944" x="78.990013" fill="#bbb"><tspan y="910.17944" x="78.990013" text-align="start" line-height="125%">永寧</tspan>
  </text>
  <text y="541.01184" x="953.54907" fill="#000"><tspan y="541.01184" x="953.54907" text-align="start" line-height="125%">南京三民</tspan>
  </text>
  <text y="541.11987" x="1052.386" fill="#bbb"><tspan y="541.11987" x="1052.386" text-align="start" line-height="125%">松山</tspan>
  </text>
  <text y="540.88586" x="849.16205" fill="#bbb"><tspan y="540.88586" x="849.16205" text-align="start" line-height="125%">台北小巨蛋</tspan>
  </text>
  <text y="735.99225" x="819.28705" fill="#bbb"><tspan y="735.99225" x="819.28705" text-align="start" line-height="125%">信義安和</tspan>
  </text>
  <text y="735.07428" x="914.83228" fill="#bbb"><tspan y="735.07428" x="914.83228" text-align="start" line-height="125%">台北101/世貿</tspan>
  </text>
  <text y="736.02576" x="1047.2061" fill="#bbb"><tspan y="736.02576" x="1047.2061" text-align="start" line-height="125%">象山</tspan>
  </text>
  <text y="673.41614" x="803.80103" fill="#bbb"><tspan y="673.41614" x="803.80103" text-align="start" line-height="125%">忠孝敦化</tspan>
  </text>
  <text y="673.44312" x="937.69305" fill="#bbb"><tspan y="673.44312" x="937.69305" text-align="start" line-height="125%">市政府</tspan>
  </text>
  <text y="673.36212" x="1037.7379" fill="#bbb"><tspan y="673.36212" x="1037.7379" text-align="start" line-height="125%">後山埤</tspan>
  </text>
  <text y="636.77814" x="854.47705" fill="#bbb"><tspan y="636.77814" x="854.47705" text-align="start" line-height="125%">國父紀念館</tspan>
  </text>
  <text y="636.83209" x="996.70203" fill="#bbb"><tspan y="636.83209" x="996.70203" text-align="start" line-height="125%">永春</tspan>
  </text>
  <text y="636.82928" x="1101.135" fill="#bbb"><tspan y="636.82928" x="1101.135" text-align="start" line-height="125%">昆陽</tspan>
  </text>
  <text y="673.40375" x="1151.432" fill="#bbb"><tspan y="673.40375" x="1151.432" text-align="start" line-height="125%">南港</tspan>
  </text>
  <text y="655.1828" x="1233.6052" fill="#bbb"><tspan y="655.1828" x="1233.6052" text-align="start" line-height="125%">南港展覽館</tspan>
  </text>
  <text y="865.07483" x="763.75177" fill="#bbb"><tspan y="865.07483" x="763.75177" text-align="start" line-height="125%">六張犁</tspan>
  </text>
  <text y="810.11084" x="764.00378" fill="#bbb"><tspan y="810.11084" x="764.00378" text-align="start" line-height="125%">科技大樓</tspan>
  </text>
  <text y="970.89465" x="836.70203" fill="#bbb"><tspan y="970.89465" x="836.70203" text-align="start" line-height="125%">辛亥</tspan>
  </text>
  <text y="955.0838" x="746.90002" fill="#bbb"><tspan y="955.0838" x="746.90002" text-align="start" line-height="125%">麟光</tspan>
  </text>
  <text y="970.89465" x="978.60303" fill="#bbb"><tspan y="970.89465" x="978.60303" text-align="start" line-height="125%">萬芳社區</tspan>
  </text>
  <text y="970.83777" x="1148.071" fill="#bbb"><tspan y="970.83777" x="1148.071" text-align="start" line-height="125%">動物園</tspan>
  </text>
  <text y="970.89111" x="1076.702" fill="#bbb"><tspan y="970.89111" x="1076.702" text-align="start" line-height="125%">木柵</tspan>
  </text>
  <text y="970.89465" x="898.46808" fill="#bbb"><tspan y="970.89465" x="898.46808" text-align="start" line-height="125%">萬芳醫院</tspan>
  </text>
  <text y="490.11084" x="762.79779" fill="#bbb"><tspan y="490.11084" x="762.79779" text-align="start" line-height="125%">中山國中</tspan>
  </text>
  <text y="425.10181" x="763.96777" fill="#bbb"><tspan y="425.10181" x="763.96777" text-align="start" line-height="125%">松山機場</tspan>
  </text>
  <text y="361.91635" x="1006.657" fill="#bbb"><tspan y="361.91635" x="1006.657" text-align="start" line-height="125%">港墘</tspan>
  </text>
  <text y="361.86685" x="931.80811" fill="#bbb"><tspan y="361.86685" x="931.80811" text-align="start" line-height="125%">西湖</tspan>
  </text>
  <text y="361.88544" x="847.63904" fill="#bbb"><tspan y="361.88544" x="847.63904" text-align="start" line-height="125%">劍南路</tspan>
  </text>
  <text y="361.93887" x="781.73804" fill="#bbb"><tspan y="361.93887" x="781.73804" text-align="start" line-height="125%">大直</tspan>
  </text>
  <text y="361.86685" x="1156.358" fill="#bbb"><tspan y="361.86685" x="1156.358" text-align="start" line-height="125%">內湖</tspan>
  </text>
  <text y="415.09283" x="1233.9292" fill="#bbb"><tspan y="415.09283" x="1233.9292" text-align="start" line-height="125%">大湖公園</tspan>
  </text>
  <text y="361.90286" x="1081.72" fill="#bbb"><tspan y="361.90286" x="1081.72" text-align="start" line-height="125%">文德</tspan>
  </text>
  <text y="535.10181" x="1233.9652" fill="#bbb"><tspan y="535.10181" x="1233.9652" text-align="start" line-height="125%">東湖</tspan>
  </text>
  <text y="595.11084" x="1233.6052" fill="#bbb"><tspan y="595.11084" x="1233.6052" text-align="start" line-height="125%">南港軟體園區</tspan>
  </text>
  <text y="475.11981" x="1233.6952" fill="#bbb"><tspan y="475.11981" x="1233.6952" text-align="start" line-height="125%">葫洲</tspan>
  </text>
 </g>
 <g fill="#ffffff" stroke-width="1.0003">
  <g stroke="#505050">
   <circle cx="448.08591" cy="672.88794" r="6.828976" transform="matrix(0.8027558 0 0 0.8027558 10.00735 123.1242)"></circle>
   <circle cx="448.08591" cy="672.88794" r="6.828976" transform="matrix(0.8027558 0 0 0.8027558 -19.992653 153.1242)"></circle>
   <circle cx="448.08591" cy="672.88794" r="6.828976" transform="matrix(0.8027558 0 0 0.8027558 -49.992653 183.1242)"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -79.99265 213.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle cx="448.08591" cy="672.88794" r="6.828976" transform="matrix(0.8027558 0 0 0.8027558 -109.99265 243.1242)"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -139.99265 273.1242)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -169.99265 303.1242)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -199.99266 333.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -229.99266 363.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 90.00734 18.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 80.00734 203.1242)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 95.00736 398.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 140.00739 353.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 185.00739 308.1242)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 395.00734 263.1242)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 395.00734 318.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 425.00734 392.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 495.00734 403.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 575.00734 403.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 655.00734 403.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 735.00734 403.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 495.00734 208.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 610.00734 208.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 535.00734 13.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 630.00734 13.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 395.00734 -56.875788)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 395.00734 -121.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 440.00736 -166.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 515.00734 -166.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 590.00734 -166.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 665.00734 -166.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 740.00734 -166.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 815.00734 -166.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 865.00734 -131.87575)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 865.00734 -71.875778)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 865.00734 -11.875748)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 865.00734 48.12419)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 180.00734 158.1242)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 265.00734 293.1242)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 298.75305 329.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 305.00734 363.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 305.00734 403.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 305.00734 443.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 305.00734 523.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 480.00734 108.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 540.00734 108.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 605.00734 108.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 655.00734 108.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 705.00734 108.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 760.00734 108.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 810.00734 108.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 180.00734 -140.91866)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 180.00734 -183.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 180.00734 -231.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 180.00734 -276.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 180.00734 -321.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 180.00734 -366.87578)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 178.52447 -406.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 150.00734 -435.54118)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 25.00734 -436.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -39.992653 -436.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -104.99265 -436.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -169.99265 -436.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -234.99266 -436.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 275.00734 -86.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 285.00734 -41.875788)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 340.0073 208.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 30.00734 -136.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -14.992653 -181.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -59.992653 -226.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -104.99265 -271.87579)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 35.00734 -51.875798)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -4.992653 -11.875798)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -44.992653 28.1242)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -84.99265 68.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -244.99266 228.1242)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -124.99265 108.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -164.99265 148.1242)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 -204.99266 188.1242)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
   <circle transform="matrix(0.8027558 0 0 0.8027558 230.00734 108.12421)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
  </g>
  <circle transform="matrix(1.0866486 0 0 1.0866486 52.798978 -82.90384)" cx="448.08591" cy="672.88794" r="6.828976" stroke="#323232"></circle>
 </g>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 205.78598 338.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 52.798978 -177.90384)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 205.78598 243.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 52.798978 -282.90384)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 205.78598 138.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <g fill="#ffffff" stroke-width="1.0003">
  <circle transform="matrix(0.8027558 0 0 0.8027558 180.00734 -41.875788)" cx="448.08591" cy="672.88794" r="6.828976" stroke="#505050"></circle>
  <circle transform="matrix(1.0866486 0 0 1.0866486 52.798978 17.09616)" cx="448.08591" cy="672.88794" r="6.828976" stroke="#323232"></circle>
 </g>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 205.78598 438.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 157.79896 17.09616)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 310.78596 438.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 157.79898 -82.90384)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 310.78598 338.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 267.79898 -82.90384)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 420.78598 338.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 267.79893 17.09616)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 420.78593 438.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 157.79898 -177.90384)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 310.78598 243.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 267.79898 -177.90384)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 420.78598 243.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 -62.20102 -82.90384)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 90.78598 338.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 105.29898 69.59616)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 258.28598 490.92053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 -52.20106 -282.90384)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 100.78594 138.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 -37.20102 -627.90384)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 115.78598 -206.57947)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 737.79898 -82.90385)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 890.78598 338.42052)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.0866486 0 0 1.0866486 177.79898 292.09616)" cx="448.08591" cy="672.88794" r="6.828976" fill="#ffffff" stroke="#323232" stroke-width="1.0003"></circle>
 <ellipse transform="matrix(0.50079411 0 0 0.49287238 330.78598 713.42053)" cx="666.79083" cy="628.69897" rx="10.542148" ry="10.195367" fill="#323232"></ellipse>
 <circle transform="matrix(1.4643471 0 0 1.4643452 -246.4424 -2.051318)" cx="448.08591" cy="672.88794" r="6.828976" fill="#fca311"></circle>
 <circle transform="matrix(1.4643471 0 0 1.4643452 -36.442393 37.948682)" cx="448.08591" cy="672.88794" r="6.828976" fill="#cce226"></circle>
 <g fill="#007c59">
  <circle transform="matrix(1.4643471 0 0 1.4643452 8.557607 117.94868)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
  <circle transform="matrix(1.4643471 0 0 1.4643452 413.5576 -432.05132)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
 </g>
 <g fill="#d12d33">
  <circle transform="matrix(1.4643471 0 0 1.4643452 408.5576 -237.05132)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
  <circle transform="matrix(1.4643471 0 0 1.4643452 -596.4424 -882.05131)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
 </g>
 <circle transform="matrix(1.4643471 0 0 1.4643452 -206.4424 -932.05131)" cx="448.08591" cy="672.88794" r="6.828976" fill="#f98e99"></circle>
 <g fill="#fca311">
  <circle transform="matrix(1.4643471 0 0 1.4643452 -581.4424 -177.05132)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
  <circle transform="matrix(1.4643471 0 0 1.4643452 -446.4424 -762.05132)" cx="448.08591" cy="672.88794" r="6.828976"></circle>
 </g>
 <circle transform="matrix(1.4643471 0 0 1.4643452 -561.4424 -47.05132)" cx="448.08591" cy="672.88794" r="6.828976" fill="#0072c6"></circle>
 <circle transform="matrix(1.4643471 0 0 1.4643452 518.5576 -42.05132)" cx="448.08591" cy="672.88794" r="6.828976" fill="#aa753f"></circle>
 <rect width="29.969549" height="30.09455" x="1150.3696" y="89.24152" fill="#d12d33" rx="0"></rect>
 <text x="1157.6844" y="114.64966" fill="#ffffff" font-family="Sans" text-align="start" word-spacing="0" line-height="125%" letter-spacing="0" font-size="28" writing-mode="lr"><tspan x="1157.6844" y="114.64966" text-align="start" line-height="125%">2</tspan>
 </text>
 <rect width="139.9848" height="30.04728" x="1185.3696" y="89.24152" fill="#d12d33" rx="0"></rect>
 <text x="1191.764" y="112.65662" fill="#ffffff" font-family="Noto Sans CJK TC Regular" word-spacing="0" line-height="125%" letter-spacing="0" font-size="22"><tspan x="1191.764" y="112.65662" font-weight="bold">淡水信義線</tspan>
 </text>
 <rect width="29.969549" height="30.09455" x="1150.3619" y="129.26517" fill="#007c59" rx="0"></rect>
 <text x="1157.6769" y="154.67329" fill="#ffffff" font-family="Sans" text-align="start" word-spacing="0" line-height="125%" font-weight="normal" letter-spacing="0" font-size="28" writing-mode="lr"><tspan x="1157.6769" y="154.67329" text-align="start" line-height="125%">3</tspan>
 </text>
 <rect width="139.9848" height="30.04728" x="1185.3696" y="129.26517" fill="#007c59" rx="0"></rect>
 <text x="1191.8521" y="152.71059" fill="#ffffff" font-family="Noto Sans CJK TC Regular" word-spacing="0" line-height="125%" font-weight="normal" letter-spacing="0" font-size="22"><tspan x="1191.8521" y="152.71059" font-weight="bold">松山新店線</tspan>
 </text>
 <rect width="29.969549" height="30.09455" x="1150.3619" y="49.26516" fill="#aa753f" rx="0"></rect>
 <text x="1157.6769" y="74.67328" fill="#ffffff" font-family="Sans" text-align="start" word-spacing="0" line-height="125%" font-weight="normal" letter-spacing="0" font-size="28" writing-mode="lr"><tspan x="1157.6769" y="74.67328" text-align="start" line-height="125%">1</tspan>
 </text>
 <rect width="139.9848" height="30.04728" x="1185.3696" y="49.26516" fill="#aa753f" rx="0"></rect>
 <text x="1191.764" y="72.7037" fill="#ffffff" font-family="Noto Sans CJK TC Regular" word-spacing="0" line-height="125%" font-weight="normal" letter-spacing="0" font-size="22"><tspan x="1191.764" y="72.7037" font-weight="bold">文湖線</tspan>
 </text>
 <rect width="29.969549" height="30.09455" x="1150.3696" y="169.24152" fill="#fca311" rx="0"></rect>
 <text x="1157.6844" y="194.64964" fill="#000000" font-family="Sans" text-align="start" word-spacing="0" line-height="125%" font-weight="normal" letter-spacing="0" font-size="28" writing-mode="lr"><tspan x="1157.6844" y="194.64964" text-align="start" line-height="125%">4</tspan>
 </text>
 <rect width="139.9848" height="30.04728" x="1185.3696" y="169.24152" fill="#fca311" rx="0"></rect>
 <text x="1190.4221" y="192.71059" fill="#000000" font-family="Noto Sans CJK TC Regular" word-spacing="0" line-height="125%" font-weight="normal" letter-spacing="0" font-size="22"><tspan x="1190.4221" y="192.71059" font-weight="bold">中和新蘆線</tspan>
 </text>
 <rect width="29.969549" height="30.09455" x="1150.3696" y="209.24155" fill="#0072c6" rx="0"></rect>
 <text x="1157.6844" y="234.64966" fill="#ffffff" font-family="Sans" text-align="start" word-spacing="0" line-height="125%" font-weight="normal" letter-spacing="0" font-size="28" writing-mode="lr"><tspan x="1157.6844" y="234.64966" text-align="start" line-height="125%">5</tspan>
 </text>
 <rect width="139.9848" height="30.04728" x="1185.3696" y="209.24155" fill="#0072c6" rx="0"></rect>
 <g word-spacing="0" line-height="125%" font-weight="normal" letter-spacing="0">
  <text x="1191.8961" y="232.6597" fill="#ffffff" font-family="Noto Sans CJK TC Regular" font-size="22"><tspan x="1191.8961" y="232.6597" font-weight="bold">板南線</tspan>
  </text>
  <g fill="#000000">
   <g font-family="sans-serif">
    <text x="1124.3645" y="1119.7668" font-size="16"><tspan x="1124.3645" y="1119.7668">http://ericyu.org/TaipeiMetro/</tspan>
    </text>
    <text x="668.66016" y="76.54858" font-size="12"><tspan x="668.66016" y="76.54858" font-family="Noto Sans CJK TC Bold" font-size="48">台北捷運路網圖</tspan>
    </text>
    <g font-size="20">
     <text x="1155.1797" y="271.9324">已蓋：001/108</text>
     <text y="300.32904" x="1155.1797">日期：</text>
    </g>
   </g>
   <g font-family="Noto Sans CJK TC Regular" text-align="start" font-size="18">
    <text x="640.01575" y="775.79132" fill="#bbb"><tspan x="640.01575" y="775.79132" text-align="start" line-height="125%">大安森林公園</tspan>
    </text>
    <text x="44.622826" y="945.13782" fill="#bbb"><tspan x="44.622826" y="945.13782" text-align="start" line-height="125%">頂埔</tspan>
    </text>
   </g>
  </g>
 </g>
</svg>
`;

export default function MrtMap() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "1369px",
        margin: "0 auto",
      }}
      dangerouslySetInnerHTML={{ __html: MRT_SVG }}
    />
  );
}
