import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import RegisterForm from './components/RegisterForm.vue';
import MyProfile from './components/MyProfile.vue';
import MyPlaces from './components/MyPlaces.vue';
import AboutPage from './components/AboutPage.vue';
import AragatsotnInfo from './components/AragatsotnInfo.vue';
import AragatsotnPlace from './components/AragatsotnPlace.vue';
import LoriInfo from './components/LoriInfo.vue';
import LoriPlace from './components/LoriPlace.vue'; 
import GegharkunikInfo from './components/GegharkunikInfo.vue'; 
import GegharkunikPlace from './components/GegharkunikPlace.vue'; 
import TavushInfo from './components/TavushInfo.vue'; 
import TavushPlace from './components/TavushPlace.vue'; 
import ShirakInfo from './components/ShirakInfo.vue'; 
import ShirakPlace from './components/ShirakPlace.vue'; 
import KotaykInfo from './components/KotaykInfo.vue'; 
import KotaykPlace from './components/KotaykPlace.vue'; 
import ArmavirInfo from './components/ArmavirInfo.vue'; 
import ArmavirPlace from './components/ArmavirPlace.vue'; 
import YerevanInfo from './components/YerevanInfo.vue'; 
import YerevanPlace from './components/YerevanPlace.vue'; 
import AraratInfo from './components/AraratInfo.vue'; 
import AraratPlace from './components/AraratPlace.vue'; 
import VayotsDzorInfo from './components/VayotsDzorInfo.vue'; 
import VayotsDzorPlace from './components/VayotsDzorPlace.vue'; 
import SyunikInfo from './components/SyunikInfo.vue'; 
import SyunikPlace from './components/SyunikPlace.vue'; 
import ProvinceInfo from './components/ProvinceInfo.vue';
import SuperuserPanel from './components/SuperuserPanel.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/register', component: RegisterForm },
    { path: '/my-profile', component: MyProfile, meta: { requiresAuth: true } }, 
    { path: '/my-places', component: MyPlaces },
    { path: '/about', component: AboutPage },
    { path: '/province-info/Aragatsotn', component: AragatsotnInfo },
    { path: '/province-info/AragatsotnPlace', component: AragatsotnPlace },
    { path: '/province-info/Lori', component: LoriInfo },
    { path: '/province-info/LoriPlace', component: LoriPlace },
    { path: '/province-info/Gegharkunik', component: GegharkunikInfo }, 
    { path: '/province-info/GegharkunikPlace', component: GegharkunikPlace },
    { path: '/province-info/Tavush', component: TavushInfo },
    { path: '/province-info/TavushPlace', component: TavushPlace },
    { path: '/province-info/Shirak', component: ShirakInfo },
    { path: '/province-info/ShirakPlace', component: ShirakPlace },
    { path: '/province-info/Kotayk', component: KotaykInfo },
    { path: '/province-info/KotaykPlace', component: KotaykPlace },
    { path: '/province-info/Armavir', component: ArmavirInfo },
    { path: '/province-info/ArmavirPlace', component: ArmavirPlace },
    { path: '/province-info/Yerevan', component: YerevanInfo },
    { path: '/province-info/YerevanPlace', component: YerevanPlace },
    { path: '/province-info/Ararat', component: AraratInfo },
    { path: '/province-info/AraratPlace', component: AraratPlace },
    { path: '/province-info/VayotsDzor', component: VayotsDzorInfo },
    { path: '/province-info/VayotsDzorPlace', component: VayotsDzorPlace },
    { path: '/province-info/Syunik', component: SyunikInfo },
    { path: '/province-info/SyunikPlace', component: SyunikPlace },
    { path: '/province-info/:province', component: ProvinceInfo },
    {
      path: '/admin',
      component: SuperuserPanel,
      beforeEnter: (to, from, next) => {
        const role = localStorage.getItem('role');
        console.log('Rolle aus dem localStorage:', role);
        if (role === 'supersuperuser') {
          next();
        } else {
          next('/register');
        }
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoggedIn = localStorage.getItem('username');

  if (requiresAuth && !isLoggedIn) {
    next('/register'); 
  } else {
    next();
  }
});

export default router;