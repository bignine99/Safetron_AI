export const getSimValue = (base: number, volatility: number, simulationMode: boolean) => {
  return simulationMode ? Math.max(0, Math.floor(base * (1 + (Math.random() * volatility - volatility/2)))) : base;
};

export const getCategoryData = (simulationMode: boolean) => ({
  labels: ['건축', '토목', '플랜트', '조경', '전기', '기타'],
  datasets: [
    { label: '추락', data: [getSimValue(3200, 0.4, simulationMode), getSimValue(1200, 0.4, simulationMode), 800, 200, 400, 500], backgroundColor: '#1e3a8a', stack: 'Stack 0' },
    { label: '협착', data: [900, getSimValue(2100, 0.5, simulationMode), 1100, 400, 100, 300], backgroundColor: '#3b82f6', stack: 'Stack 0' },
    { label: '타격', data: [1500, 800, 400, 100, 200, 700], backgroundColor: '#93c5fd', stack: 'Stack 0' },
  ]
});

export const getBubbleData = (simulationMode: boolean) => ({
  datasets: [{
    label: '사고유형 군집',
    data: [
      { x: getSimValue(80, 0.2, simulationMode), y: getSimValue(65, 0.3, simulationMode), r: getSimValue(20, 0.5, simulationMode), type: '추락' },
      { x: getSimValue(40, 0.2, simulationMode), y: getSimValue(85, 0.3, simulationMode), r: getSimValue(15, 0.5, simulationMode), type: '협착' },
      { x: getSimValue(60, 0.2, simulationMode), y: getSimValue(45, 0.3, simulationMode), r: getSimValue(10, 0.5, simulationMode), type: '충돌' },
      { x: getSimValue(95, 0.2, simulationMode), y: getSimValue(90, 0.3, simulationMode), r: getSimValue(25, 0.5, simulationMode), type: '붕괴' },
      { x: getSimValue(30, 0.2, simulationMode), y: getSimValue(20, 0.3, simulationMode), r: getSimValue(8, 0.5, simulationMode), type: '전도' },
    ],
    backgroundColor: 'rgba(37, 99, 235, 0.6)',
    borderColor: '#1e40af',
    borderWidth: 1
  }]
});

export const getRadarData = (simulationMode: boolean) => ({
  labels: ['가설구조물', '건설기계', '운반기계', '수공구', '자재', '환경/지형'],
  datasets: [{
    label: '위험도 지표',
    data: [getSimValue(88, 0.3, simulationMode), getSimValue(95, 0.3, simulationMode), 70, 40, 65, 80],
    backgroundColor: 'rgba(71, 85, 105, 0.2)',
    borderColor: '#334155',
    pointBackgroundColor: '#0f172a',
    borderWidth: 2
  }]
});

export const getGaugeData = (simulationMode: boolean) => ({
  datasets: [{
    data: [getSimValue(76, 0.4, simulationMode), 100 - getSimValue(76, 0.4, simulationMode)],
    backgroundColor: ['#0f172a', '#e2e8f0'],
    borderWidth: 0,
    circumference: 180,
    rotation: 270
  }]
});

export const heatmapBaseValues = [43, 85, 21, 67, 92, 14, 55, 78, 33, 9, 74, 50];

export const sampleDB = Array.from({length: 50}, (_, i) => ({
  id: \`SAF-\${2020 + (i%5)}-\${String(i).padStart(4, '0')}\`,
  company: ['현대건설', '삼성물산', 'GS건설', '포스코이앤씨', '대우건설', '동부엔지니어링'][i%6],
  category: ['건축', '토목', '플랜트'][i%3],
  process: ['철근콘크리트', '가설공사', '토공사', '안전시설'][i%4],
  cause: ['작업절차미준수', '개인보호구미착용', '장비결함', '감독소홀'][i%4],
  object: ['비계', '굴착기', '타워크레인', '지게차'][i%4],
  status: ['자재운반', '거푸집조립', '철근배근', '콘크리트타설'][i%4],
  location: ['지하1층', '지상12층', '현장외부', '옥상'][i%4],
  type: ['추락', '협착', '충돌', '전도'][i%4],
  fatality: ['사망1, 부상0', '부상2', '경상1', '사망0, 중상1'][i%4]
}));
