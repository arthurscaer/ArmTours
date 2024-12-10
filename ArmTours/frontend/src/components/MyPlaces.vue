<template>
  <menu-bar :user="username" :role="role" :profileImageUrl="profileImageUrl" @logout="logout" />
  <div id="whole-page">
    <div class="my-places">
      <h2>Hier entdecken Sie alle Provinzen!</h2>
      <p>Erhalten Sie Informationen über die Provinzen und besuchen Sie die Kirchen und Sehenswürdigkeiten in diesen
        Provinzen.</p>
    </div>
    <div class="province-list">
      <div v-for="province in provinces" :key="province.name" class="province-item">
        <img :src="province.image" alt="Bild von {{ province.name }}" class="province-image" />
        <div class="province-info">
          <h3>{{ province.name }}</h3>
          <p v-html="province.description"></p>
          <div class="button-group">
            <button @click="goToProvince(province.name)">Kirchen</button>
            <button @click="goToProvinceInfo(province.name)">Sehenswürdigkeiten</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuBar from '@/components/MenuBar';
import YerevanImage from '@/assets/yerevan.jpg';
import AragatsotnImage from '@/assets/aragatsotn.jpg';
import AraratImage from '@/assets/ararat.jpg';
import ArmavirImage from '@/assets/armavir.jpg';
import GegharkunikImage from '@/assets/gegharkunik.jpg';
import KotaykImage from '@/assets/kotayk.jpg';
import LoriImage from '@/assets/lori.jpg';
import ShirakImage from '@/assets/shirak.jpg';
import SyunikImage from '@/assets/syunik.jpg';
import TavushImage from '@/assets/tavush.jpg';
import VayotsDzorImage from '@/assets/vayotsdzor.jpg';

export default {
  name: 'MyPlaces',
  components: {
    MenuBar
  },
  data() {
    return {
      username: localStorage.getItem('username') || '',
      role: localStorage.getItem('role') || '',
      profileImageUrl: localStorage.getItem('profileImageUrl') || '',
      provinces: [
        {
          name: 'Yerevan',
          image: YerevanImage,
          description: 'Yerevan ist die Hauptstadt der Republik Armenien. Die Geschichte der Stadt reicht bis zur urartäischen Festung Erebuni zurück, die 782 v. Chr. von König Argishti I erbaut wurde. Dies bedeutet, dass Yerevan 29 Jahre älter ist als Rom und zu den ältesten Städten der Welt gehört. Die Ruinen der Festung, die heute Teil des Erebuni-Museums sind, befinden sich im östlichen Teil der Stadt.<br><br><strong>Gegründet:</strong> 782 v. Chr.</br><strong>Bevölkerung:</strong> 1,075 Millionen (2016)</br> <strong>Höhe:</strong> 1400m in Norden und 860m in Süden <br><strong>Kirchen und Kathedrale:</strong> Kathedrale des Heiligen Gregor des Erleuchters, Katoghike-Kirche, Arabkir Kirche </br>'
        },
        {
          name: 'Aragatsotn',
          image: AragatsotnImage,
          description: 'Die Region Aragatsotn grenzt im Südosten an Yerevan, im Süden an Armavir, im Nordwesten an Shirak, im Norden an Lori, im Osten an Kotayk und im Westen an die Nordosttürkei. <br><br><strong>Entfernung:</strong> 22 km nordöstlich von Yerevan nach Ashtarak</br> <strong>Zentrum:</strong> Stadt Ashtarak (21.000 Einwohner)</br> <strong>Anzahl der Städte:</strong> 3 (Ashtarak, Aparan, Talin) <strong> Höchster Berg:</strong> Aragats (4090 m) <br><strong> Klöster und Kirchen:</strong> Saghmosavank, Hovhanavank, Aruch, Tegher, Oshakan, Mughni, Artavazik</br> <strong>Weitere Sehenswürdigkeiten:</strong> Observatorium Byurakan, Mausoleum von Aghts'
        },
        {
          name: 'Ararat',
          image: AraratImage,
          description: 'Die Region Ararat grenzt im Westen an die Türkei, im Südwesten an Aserbaidschan (Nakhijevan), im Nordwesten an die Region Armavir, im Nordosten an Kotayk, im Osten an Gegharkunik und im Südosten an Vayots Dzor. Das Klima der Region ist trocken. Das gebirgige Gebiet besteht aus den Felsen und Bergen von Urtsi und Yeranos. <br> <br> <strong>Entfernung:</strong> 29 km südwestlich von Yerevan nach Artashat </br> <strong>Zentrum:</strong> Artashat (26.000 Einwohner)</br> <strong>Anzahl der Städte:</strong> 4 (Artashat, Ararat, Masis, Vedi) <strong>Bevölkerung:</strong> 280.000 Einwohner.Höhe: 1600-2300m <br><strong>Klöster und Kirchen:</strong> Khor Virap, Hovhannes-Karapet, Stepanos</br> <strong>Weitere Sehenswürdigkeiten:</strong> Vishapakars (Drachensteine), Nationalpark Khosrov'
        },
        {
          name: 'Armavir',
          image: ArmavirImage,
          description: 'Das Klima der Region ist trocken. Der einzige Fluss, der in der Region entspringt, ist der Mezamor. Hier befindet sich auch das einzige Kernkraftwerk des Landes und der gesamten Region. <br> <br>  <strong> Entfernung:</strong> 20 km westlich von Yerevan nach Vagharshapat </br><strong> Zentrum:</strong> Armavir (33.000 Einwohner) <br><strong> Anzahl der Städte:</strong> 3 (Vagharshapat, Armavir, Mezamor)</br> <strong>Bevölkerung:</strong> 285.000 Einwohner <br><strong>Klöster und Kirchen:</strong> Ejmiadzin, Gayane, Hripsime, Zvartnots, Shogakat, S. Astvatsatsin</br> <strong>Weitere Sehenswürdigkeiten:</strong> die Ruinen der urartäischen Stadt Argistikhinili, die Ruinen der antiken Hauptstadt Yervandashat, Denkmal von Sardarapat.'
        },
        {
          name: 'Gegharkunik',
          image: GegharkunikImage,
          description: 'Gegharkunik grenzt im Norden an die Regionen Tavush und Lori, im Süden an Vayots Dzor, im Südwesten an die Ararat-Region, im Westen an Kotayk und im Osten an Aserbaidschan. <br> <br>  <strong> Entfernung: </strong> 92 km nordöstlich von Yerevan nach Gavar </br> <strong> Zentrum: </strong> Gavar (26.000 Einwohner) <br> <strong> Bevölkerung:</strong> 242.000 Einwohner </br> <strong> Anzahl der Städte:</strong> 5 (Gavar, Sevan, Tscahmbarak, Martuni, Vardenis) <br> <strong> Höchste Berge: </strong> Azhdahak (3598 m), Spitakasar (3555 m), Vardenis (3522 m), Geghasar (3446 m) </br> <strong> Klöster und Kirchen: </strong> Sevanavank, Hayravank, Hatsarat, Gavar, Vanevan <br> <strong> Landschaft: </strong> Geghama-Gebirgszug, Artanish, See Sevan</br>'
        },
        {
          name: 'Kotayk',
          image: KotaykImage,
          description: 'Kotayk ist die einzige Region, die keine externen Staatsgrenzen hat. Sie grenzt im Südwesten an die Hauptstadt, im Westen an die Aragatsotn-Region, im Nordosten an die Tavush-Region, im Norden an die Lori-Region, im Osten an Gegharkunik und im Süden an Ararat. Die Gesundheitsresorts von Arzni und Hanqavan, die in der Nähe der Quellen liegen, befinden sich in der Kotayk-Region. <br> <br> <strong> Entfernung: </strong> 50 km nordöstlich von Yerevan nach Hrazdan </br> <strong> Zentrum: </strong> Hrazdan (54.000 Einwohner)</br> <strong> Bevölkerung: </strong> 282.000 Einwohner <br> <strong> Anzahl der Städte: </strong> 7  </br> <strong> Höchster Berg: </strong> Arailer (2577 m) <br> <strong> Klöster und Kirchen: </strong> Geghard, Kecharis, Getargel, Yeghvard, Zoravar, Bjni, Teghenyats, Maqravan, Neghuts, Ptghni, Mayravank</br>'
        },
        {
          name: 'Lori',
          image: LoriImage,
          description: 'Die typische Landschaft von Lori zeigt weitläufige Gebirgszüge mit voralpiner Vegetation, tiefen Schluchten, geschichteten Hängen und zerklüfteten Berghängen. Die größten Flüsse sind Debed und seine Nebenflüsse Dzoraget, Marts und Pambak. Die Region ist reich an Mineralien. Das Klima ist mild und feucht. <br> <br> <strong>Entfernung: </strong> 116 km nordöstlich von Yerevan nach Vanadzor </br> <strong> Bevölkerung: </strong> 282.000 Einwohner </br> <strong> Zentrum: </strong> Vanadzor (104.000 Einwohner) <br> <strong> Anzahl der Städte: </strong> 8 </br> <strong> Höchster Berg: </strong> Tezh (3110m) <br> <strong> Klöster und Kirchen: </strong> Sanahin, Haghpat, Akhtala, Odzun, Kobayr, nevant, Khutchap, Kurtan, Horomayr, Dzgrashen, St. Gregory Barzragash, Ardvi, Khorakert, Garanist Mankin, Tormakavank, Manstev, Sedvi, Shnogh, Dorband </br>'
        },
        {
          name: 'Shirak',
          image: ShirakImage,
          description: 'Das Ashotsk-Plateau liegt in der Region Shirak. Seine Höhe erreicht 1800-2200m über dem Meeresspiegel. Die absolute Minimaltemperatur beträgt -46 °C. Dies ist das kälteste Gebiet der Republik und wird oft als „Pol der Kälte“ bezeichnet. Der einzige große Fluss der Region ist der Akhuryan, der aus dem Arpi-See entspringt. <br> <br> <strong> Entfernung: </strong> 126 km nordwestlich von Jerewan nach Gyumri </br> <strong> Bevölkerung: </strong> 280.000 Einwohner </br> <strong> Zentrum: </strong> Gyumri (146.000 Einwohner) <br> <strong> Anzahl der Städte: </strong> 3 (Gyumri, Artik, Maralik) </br> <strong> Höhe: </strong> 1500-2000m über dem Meeresspiegel <br> <strong> Klöster und Kirchen: </strong> Marmashen, Haritchavank, Yereruyk, Lmbatavank, Artik, Yoth Verq, Pemzashen </br>'
        },
        {
          name: 'Syunik',
          image: SyunikImage,
          description: 'Syunik grenzt im Norden an die Vayots Dzor-Region, im Süden an den Iran, im Westen an Nakhijevan (Aserbaidschan) und im Osten an Berg-Karabach. Syunik ist die gebirgigste Region des Landes. Der Höhenunterschied zwischen dem höchsten Punkt (Kapujugh, 3905m) und dem tiefsten Punkt (Meghri-Schlucht, -375m) beträgt 3500m. <br> <br> <strong> Entfernung: </strong> 320 km südlich von Yerevan nach Kapan </br> <strong> Zentrum: </strong> Kapan (45.500 Einwohner) </br> <strong> Bevölkerung: </strong> 153.000 Einwohner <br> <strong> Anzahl der Städte: </strong> 7 (Kapan, Kajaran, Goris, Sisian, Meghri, Agarak, Dastakert) </br> <strong> Klöster und Kirchen: </strong> Tatev, Vorotnavank, Vahanavank, Sisavan, Vorotnaberd, Halidzor </br> <strong> Andere Sehenswürdigkeiten: </strong> Zorats Karer (Karahunj) Observatorium, Teufelsbrücke, Tatev-Wüste, Akhitu, Dorf Khndzoresk '
        },
        {
          name: 'Tavush',
          image: TavushImage,
          description: 'Die Tavush-Region grenzt im Süden und Südosten an die Regionen Gegharkunik und Kotayk, im Westen an Lori, im Westen an Georgien und im Osten und Nordosten an Aserbaidschan. Die Grenze zu Letzterem ist 300km lang. <br> <br> <strong> Entfernung: </strong> 136 km nordöstlich von Yerevan nach Ijevan </br> <strong> Bevölkerung: </strong> 135.000 Einwohner </br> <strong> Zentrum: </strong> Ijevan (20.000 Einwohner) <br> <strong> Anzahl der Städte: </strong> 5 (Ijevan, Dilijan, Ayrum, Berd, Noyemberyan) </br> <strong> Klöster und Kirchen: </strong> Goshavank, Haghartsin, Makaravank, Kaptavank, Dzukhtak, Mshakavank, Atcharkut, Arakelots, Deghdznut, Kirants, Navur, Nor Varagavank, Shjmuradi, Voskepar, Srvegh, Lastiver, Samson'
        },
        {
          name: 'VayotsDzor',
          image: VayotsDzorImage,
          description: 'Die Höhlen sind typische Elemente der Region Vayots Dzor, und unter ihnen sind die bekanntesten die Magil- und Mozrov-Höhlen. Letztere wurde während des Straßenbaus entdeckt und hat eine Tiefe von über 300m. In der Höhle, in ihren riesigen "Räumen", kann man eine große Anzahl von Stalaktiten und Stalagmiten sehen, die sich von unten bis zur Decke erstrecken. <br> <br> <strong> Entfernung: </strong> 123 km südöstlich von Jerewan nach Yeghegnadzor </br> <strong> Zentrum:  </strong> Yeghegnadzor (8.000 Einwohner) </br> <strong> Bevölkerung: </strong> 56.000 Einwohner <br> <strong> Anzahl der Städte: </strong> 3 (Yeghegnadzor, Vayk, Jermuk) </br> <strong> Klöster und Kirchen: </strong> Noravank, Gladzor, Gndevank, Yeghegis, Zorats, Tanade, Areni, Arkazi, Spitakavar, Tsaghats Qar <br> <strong> Weitere Sehenswürdigkeiten: </strong> Selim-Karawanserei, Magil- und Mozrov-Höhlen </br>'
        },
      ]
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('vorname');
      localStorage.removeItem('nachname');
      localStorage.removeItem('birthdate');
      localStorage.removeItem('profileImageUrl');
      this.$router.push('/');
    },
    goToProvince(provinceName) {
      this.$router.push(`/province-info/${provinceName}`);
    },
    goToProvinceInfo(provinceName) {
      this.$router.push(`/province-info/${provinceName}Place`);
    }
  }
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

#whole-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #EEF7FF;
  font-family: 'Roboto', sans-serif;
}

.my-places {
  flex: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin: 10px;
}

h2 {
  color: #333;
  margin-bottom: 5px;
}

p {
  color: #555;
  margin-bottom: 10px;
}

.province-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px;
}

.province-item {
  display: flex;
  align-items: center;
  margin: 10px;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  max-width: 45%;
  width: calc(50% - 20px);
  overflow: hidden;
}

.province-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.province-image {
  width: 150px;
  height: auto;
  border-radius: 12px;
  margin-right: 20px;
  transition: transform 0.3s;
}

.province-image:hover {
  transform: scale(1.05);
}

.province-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h3 {
  color: #007BFF;
  margin: 0;
}

.button-group {
  display: flex;
  margin-top: 10px;
}

button {
  margin-right: 10px;
  padding: 12px 20px;
  background-color: #6495ed;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  font-weight: bold;
}

button:hover {
  background-color: #00008b;
  transform: translateY(-2px);
}

.province-image {
  width: 150px;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
  margin-right: 20px;
  transition: transform 0.3s;
}

@media (max-width: 600px) {
  .province-list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: 0;
    padding: 0;
  }

  .province-item {
    width: 100%;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    border-radius: 12px;
    background: #fff;
    max-width: 90%;
  }

  .province-image {
    width: 50%;
    height: auto;
    margin: 0 0 10px 0;
  }

  .button-group {
    flex-direction: column;
    width: 100%;
  }

  button {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>

