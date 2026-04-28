import { useEffect, useState } from 'react';
import { collection, doc, setDoc, writeBatch, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useStore } from '../store';
import type { Phase, Stage, Area, Module, Role, ProjectCard } from '../types';


const initialStages: Stage[] = [
  { id: 'Инициация', title: 'Инициация' },
  { id: 'Концепция', title: 'Концепция' },
  { id: 'Проектирование', title: 'Проектирование' },
  { id: 'Строительство', title: 'Строительство' },
  { id: 'Пусконаладка', title: 'Пусконаладка' },
  { id: 'Ввод в эксплуатацию', title: 'Ввод в эксплуатацию' }
];

const initialPhases: Phase[] = [
  { id: 'Фаза 1', title: 'ФАЗА 1. ИНИЦИИРОВАНИЕ', result: 'Решение о проработке вариантов' },
  { id: 'Фаза 2', title: 'ФАЗА 2. ОЦЕНКА', result: 'Выбор варианта для детальной проработки' },
  { id: 'Фаза 3', title: 'ФАЗА 3. ВЫБОР', result: 'Финальное инвестиционное решение' },
  { id: 'Фаза 4', title: 'ФАЗА 4. ОПРЕДЕЛЕНИЕ', result: 'Утверждение бюджета на реализацию' },
  { id: 'Фаза 5', title: 'ФАЗА 5. РЕАЛИЗАЦИЯ', result: 'Механическая готовность объекта' },
  { id: 'Фаза 6', title: 'ФАЗА 6. ЗАВЕРШЕНИЕ', result: 'Ввод в эксплуатацию' }
];

const initialAreas: Area[] = [
  { id: 'Управление интеграцией', name: 'Управление интеграцией', shortName: 'Интеграция', color: '#b794f4' },
  { id: 'Управление стоимостью', name: 'Управление стоимостью', shortName: 'Стоимость', color: '#63b3ed' },
  { id: 'Управление сроками', name: 'Управление сроками', shortName: 'Сроки', color: '#68d391' },
  { id: 'Управление закупками/контрактами', name: 'Управление закупками/контрактами', shortName: 'Закупки', color: '#fbd38d' },
  { id: 'Управление рисками', name: 'Управление рисками', shortName: 'Риски', color: '#fc8181' },
  { id: 'Проектный контроль', name: 'Проектный контроль', shortName: 'Контроль', color: '#4fd1c5' }
];

const initialModules: Module[] = [
  { id: 'PM.integrator', name: 'PM.integrator', color: '#80deea' },
  { id: 'PM.cost', name: 'PM.cost', color: '#a5d6a7' },
  { id: 'PM.planner', name: 'PM.planner', color: '#90caf9' },
  { id: 'PM.customer', name: 'PM.customer', color: '#ffcc80' }
];

const initialRoles: Role[] = [
  { id: 'Заказчик', name: 'Заказчик', color: '#d97706' },
  { id: 'Инвестор', name: 'Инвестор', color: '#2563eb' },
  { id: 'EPC', name: 'EPC', color: '#059669' }
];

const initialCards: ProjectCard[] = [
  {"id": "1", "phase": ["Фаза 1"], "stage": ["Инициация"], "area": ["Управление стоимостью"], "title": "Концептуальная оценка стоимости проекта (5-й класс)", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.cost", "PM.customer"], "desc": "", "link": "", "checklist": []},
  {"id": "2", "phase": ["Фаза 2"], "stage": ["Концепция"], "area": ["Управление интеграцией"], "title": "Паспорт проекта и команда проекта", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.integrator"], "desc": "", "link": "", "checklist": []},
  {"id": "3", "phase": ["Фаза 1"], "stage": ["Инициация"], "area": ["Управление сроками"], "title": "Директивный график проекта (I уровень: вехи, этапы)", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.planner"], "desc": "", "link": "", "checklist": []},
  {"id": "4", "phase": ["Фаза 1"], "stage": ["Инициация"], "area": ["Управление интеграцией"], "title": "Паспорт проекта (Идея, цели, концепции, ограничения проекта, заинтересованные стороны)", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.integrator"], "desc": "", "link": "", "checklist": []},
  {"id": "5", "phase": ["Фаза 2"], "stage": ["Концепция"], "area": ["Управление стоимостью"], "title": "Оценка стоимости проекта (4-й класс)", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.cost", "PM.customer"], "desc": "", "link": "", "checklist": []},
  {"id": "6", "phase": ["Фаза 2"], "stage": ["Концепция"], "area": ["Управление сроками"], "title": "Управленческий график проекта (II уровень: этапы, основные объекты и виды работ )", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.planner"], "desc": "", "link": "", "checklist": []},
  {"id": "7", "phase": ["Фаза 2"], "stage": ["Концепция"], "area": ["Управление закупками/контрактами"], "title": "Предварительная контрактная стратегия", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.customer"], "desc": "", "link": "", "checklist": []},
  {"id": "8", "phase": ["Фаза 2"], "stage": ["Концепция"], "area": ["Управление стоимостью"], "title": "ТЭО и предварительный Бюджет проекта", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.customer"], "desc": "", "link": "", "checklist": []},
  {"id": "9", "phase": ["Фаза 2"], "stage": ["Концепция"], "area": ["Управление рисками"], "title": "Предварительный реестр рисков проекта", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.integrator"], "desc": "", "link": "", "checklist": []},
  {"id": "10", "phase": ["Фаза 3"], "stage": ["Проектирование"], "area": ["Управление интеграцией"], "title": "Цифровой проектный офис, фиксация лицензиаров, фиксация КПЭ проекта", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.integrator"], "desc": "", "link": "", "checklist": []},
  {"id": "11", "phase": ["Фаза 3"], "stage": ["Проектирование"], "area": ["Управление стоимостью"], "title": "Предварительная оценка стоимости проекта (3-й класс)", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.cost", "PM.customer"], "desc": "", "link": "", "checklist": []},
  {"id": "12", "phase": ["Фаза 3"], "stage": ["Проектирование"], "area": ["Управление сроками"], "title": "Комплексный график проекта (III уровень: виды работ)", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.planner"], "desc": "", "link": "", "checklist": []},
  {"id": "13", "phase": ["Фаза 3"], "stage": ["Проектирование"], "area": ["Управление закупками/контрактами"], "title": "Утвержденная Контрактная стратегия", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.customer"], "desc": "", "link": "", "checklist": []},
  {"id": "14", "phase": ["Фаза 3"], "stage": ["Проектирование"], "area": ["Управление стоимостью"], "title": "ТЭО и Директивный бюджет, учет источников финансирования проекта", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.customer"], "desc": "", "link": "", "checklist": []},
  {"id": "15", "phase": ["Фаза 3"], "stage": ["Проектирование"], "area": ["Управление рисками"], "title": "Утвержденный реестр рисков проекта", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.integrator"], "desc": "", "link": "", "checklist": []},
  {"id": "16", "phase": ["Фаза 4"], "stage": ["Проектирование"], "area": ["Управление интеграцией"], "title": "Цифровой проектный офис, определение ответственных по направлениям, документооборот, уточненный КПЭ проекта", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.integrator"], "desc": "", "link": "", "checklist": []},
  {"id": "17", "phase": ["Фаза 4"], "stage": ["Проектирование"], "area": ["Управление стоимостью"], "title": "Утврежденная оценка стоимости проекта (3-й класс)", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.cost"], "desc": "", "link": "", "checklist": []},
  {"id": "18", "phase": ["Фаза 4"], "stage": ["Проектирование"], "area": ["Управление сроками"], "title": "Детальный график проекта (III - IV уровень: виды работ и операции)", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.planner"], "desc": "", "link": "", "checklist": []},
  {"id": "19", "phase": ["Фаза 4"], "stage": ["Проектирование"], "area": ["Управление закупками/контрактами"], "title": "Актуализированная Контрактная стратегия с учетом ключевых закупочных процедур", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.customer"], "desc": "", "link": "", "checklist": []},
  {"id": "20", "phase": ["Фаза 4"], "stage": ["Проектирование"], "area": ["Управление стоимостью"], "title": "Бюджет проекта фазы Реализаци", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.customer"], "desc": "", "link": "", "checklist": []},
  {"id": "21", "phase": ["Фаза 4"], "stage": ["Проектирование"], "area": ["Управление рисками"], "title": "Утвержденный реестр рисков проекта", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.integrator"], "desc": "", "link": "", "checklist": []},
  {"id": "22", "phase": ["Фаза 5"], "stage": ["Строительство"], "area": ["Управление интеграцией"], "title": "Координация, стройконтроль, документооборот", "roles": ["EPC"], "modules": ["PM.integrator"], "desc": "", "link": "", "checklist": []},
  {"id": "23", "phase": ["Фаза 5"], "stage": ["Строительство"], "area": ["Управление стоимостью"], "title": "Оценка стоимости проекта (2-й класс), контроль изменений", "roles": ["EPC"], "modules": ["PM.cost"], "desc": "", "link": "", "checklist": []},
  {"id": "24", "phase": ["Фаза 5"], "stage": ["Строительство"], "area": ["Управление стоимостью"], "title": "Оценка стоимости проекта (1-й класс), контроль изменений", "roles": ["EPC"], "modules": ["PM.cost"], "desc": "", "link": "", "checklist": []},
  {"id": "25", "phase": ["Фаза 5"], "stage": ["Строительство"], "area": ["Управление сроками"], "title": "Актуализированный график проекта (I - II - III - IV уровень), контроль директивных сроков", "roles": ["EPC"], "modules": ["PM.planner"], "desc": "", "link": "", "checklist": []},
  {"id": "26", "phase": ["Фаза 5"], "stage": ["Строительство"], "area": ["Управление закупками/контрактами"], "title": "Актуализированная Контрактная стратегия с учетом закупочных процедур", "roles": ["Заказчик", "Инвестор", "EPC"], "modules": ["PM.customer"], "desc": "", "link": "", "checklist": []},
  {"id": "27", "phase": ["Фаза 5"], "stage": ["Строительство"], "area": ["Управление стоимостью"], "title": "Актуализированный Бюджет фазы Реализация, контроль лимитов", "roles": ["EPC"], "modules": ["PM.customer"], "desc": "", "link": "", "checklist": []},
  {"id": "28", "phase": ["Фаза 5"], "stage": ["Строительство"], "area": ["Управление рисками"], "title": "Актуализированный реестр рисков проекта", "roles": ["Заказчик", "Инвестор", "EPC"], "modules": ["PM.integrator"], "desc": "", "link": "", "checklist": []},
  {"id": "29", "phase": ["Фаза 5"], "stage": ["Строительство"], "area": ["Проектный контроль"], "title": "Отчетность о ходе реализации проекта и прогноз", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.integrator"], "desc": "", "link": "", "checklist": []},
  {"id": "30", "phase": ["Фаза 6"], "stage": ["Ввод в эксплуатацию"], "area": ["Управление интеграцией"], "title": "Итоги и результаты проекта, передача документации эксплуатирующей службе, фиксация выученных уроков", "roles": ["Заказчик"], "modules": ["PM.integrator"], "desc": "", "link": "", "checklist": []},
  {"id": "31", "phase": ["Фаза 6"], "stage": ["Ввод в эксплуатацию"], "area": ["Управление стоимостью"], "title": "Финальная оценка стоимости проекта (1-й класс), актуализированная историчесая базы проектов", "roles": ["Заказчик", "Инвестор", "EPC"], "modules": ["PM.cost"], "desc": "", "link": "", "checklist": []},
  {"id": "32", "phase": ["Фаза 6"], "stage": ["Ввод в эксплуатацию"], "area": ["Управление сроками"], "title": "Фактический график проекта (I - II - III - IV уровень), актуализированная историчесая базы проектов", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.planner"], "desc": "", "link": "", "checklist": []},
  {"id": "33", "phase": ["Фаза 6"], "stage": ["Ввод в эксплуатацию"], "area": ["Управление сроками"], "title": "График гарантийного сопровождения", "roles": ["EPC"], "modules": ["PM.planner"], "desc": "", "link": "", "checklist": []},
  {"id": "34", "phase": ["Фаза 6"], "stage": ["Ввод в эксплуатацию"], "area": ["Управление стоимостью"], "title": "Исполнительный бюджет проекта, постинвестиционный мониторинг", "roles": ["Заказчик", "Инвестор", "EPC"], "modules": ["PM.customer"], "desc": "", "link": "", "checklist": []},
  {"id": "35", "phase": ["Фаза 6"], "stage": ["Ввод в эксплуатацию"], "area": ["Управление рисками"], "title": "Финальный реестр рисков проекта, актуализированная историчесая база системных рисков", "roles": ["Заказчик", "Инвестор"], "modules": ["PM.integrator"], "desc": "", "link": "", "checklist": []},
];

export function useFirebaseSync() {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, setDirectories, setCards } = useStore();
  const isDemo = import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here';

  useEffect(() => {
    if (!isAuthenticated) return;

    if (isDemo) {
      setDirectories(initialPhases, initialStages, initialAreas, initialModules, initialRoles);
      setCards(initialCards);
      setIsReady(true);
      return;
    }

    const configRef = doc(db, 'config', 'directories');
    const unsubscribeConfig = onSnapshot(configRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDirectories(
          data.phases || initialPhases,
          data.stages || initialStages,
          data.areas || initialAreas,
          data.modules || initialModules,
          data.roles || initialRoles
        );
      } else {
        await setDoc(configRef, { 
          phases: initialPhases, 
          stages: initialStages,
          areas: initialAreas, 
          modules: initialModules, 
          roles: initialRoles 
        });
      }
    });

    const cardsCol = collection(db, 'cards');
    const unsubscribeCards = onSnapshot(cardsCol, async (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        initialCards.forEach(c => {
           const ref = doc(db, 'cards', c.id.toString());
           batch.set(ref, c);
        });
        await batch.commit();
      } else {
        setCards(snapshot.docs.map(d => d.data() as ProjectCard));
        setIsReady(true);
      }
    });

    return () => {
      unsubscribeConfig();
      unsubscribeCards();
    };
  }, [isAuthenticated, setDirectories, setCards]);

  return { isReady };
}
