import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const choices = [
  { name: '가위', emoji: '✌️', imageKey: 'scissors' },
  { name: '바위', emoji: '✊', imageKey: 'rock' },
  { name: '보', emoji: '✋', imageKey: 'paper' },
];

const resultImages = {
  scissors: [
    require('./assets/rps/scissors_1.png'),
    require('./assets/rps/scissors_2.png'),
    require('./assets/rps/scissors_3.png'),
    require('./assets/rps/scissors_4.png'),
    require('./assets/rps/scissors_5.png'),
    require('./assets/rps/scissors_6.png'),
  ],
  rock: [
    require('./assets/rps/rock_1.png'),
    require('./assets/rps/rock_2.png'),
    require('./assets/rps/rock_3.png'),
    require('./assets/rps/rock_4.png'),
    require('./assets/rps/rock_5.png'),
    require('./assets/rps/rock_6.png'),
  ],
  paper: [
    require('./assets/rps/paper_1.png'),
    require('./assets/rps/paper_2.png'),
    require('./assets/rps/paper_3.png'),
    require('./assets/rps/paper_4.png'),
    require('./assets/rps/paper_5.png'),
    require('./assets/rps/paper_6.png'),
  ],
};

const loadingMessages = [
  '오늘의 운세 점치는 중...',
  '상대방의 심리 패턴 역추적 중...',
  '가위바위보 승률 알고리즘 분석 중...',
  '화면에 비친 표정으로 사용자 감정 분석 중...',
  '손가락 근육의 미세 떨림 계산 중...',
  '전 세계 가위바위보 빅데이터 대조 중...',
  '거의 다 이긴 척하는 중...',
];

// 배열에서 무작위 항목 하나를 꺼내는 작은 도우미 함수입니다.
function pickRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

// 승률을 6개 구간으로 나누어 어떤 이미지를 쓸지 정합니다.
function getImageIndexByWinRate(rate) {
  if (rate <= 50) return 0;
  if (rate <= 60) return 1;
  if (rate <= 70) return 2;
  if (rate <= 80) return 3;
  if (rate <= 90) return 4;
  return 5;
}

// 추천 이름을 이미지 파일 이름에 맞는 영문 키로 바꿉니다.
function getImageKey(recommendation) {
  if (recommendation.imageKey) return recommendation.imageKey;
  if (recommendation.name === '가위') return 'scissors';
  if (recommendation.name === '바위') return 'rock';
  return 'paper';
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [recommendation, setRecommendation] = useState(null);
  const [winRate, setWinRate] = useState(0);
  const [drawPattern, setDrawPattern] = useState([]);

  // 로딩 화면일 때만 0.7초마다 문구가 바뀌도록 합니다.
  useEffect(() => {
    if (screen !== 'loading') {
      return undefined;
    }

    const messageTimer = setInterval(() => {
      setLoadingIndex((currentIndex) => (
        (currentIndex + 1) % loadingMessages.length
      ));
    }, 700);

    const resultTimer = setTimeout(() => {
      const nextRecommendation = pickRandomItem(choices);
      const nextPattern = [
        pickRandomItem(choices),
        pickRandomItem(choices),
        pickRandomItem(choices),
      ];

      setRecommendation(nextRecommendation);
      setWinRate(Math.floor(Math.random() * 60) + 40);
      setDrawPattern(nextPattern);
      setScreen('result');
    }, 5000);

    // 화면이 바뀌면 타이머를 정리해서 중복 실행을 막습니다.
    return () => {
      clearInterval(messageTimer);
      clearTimeout(resultTimer);
    };
  }, [screen]);

  function startRecommendation() {
    setLoadingIndex(0);
    setScreen('loading');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <StatusBar style="dark" />

        <View style={styles.appShell}>
          <Text style={styles.appName}>가위바위보 추천기</Text>

          {screen === 'home' && (
            <View style={styles.card}>
              <Text style={styles.title}>오늘 뭐 낼까?</Text>
              <Text style={styles.heroEmoji}>✌️ ✊ ✋</Text>
              <Text style={styles.description}>
                버튼을 누르면 오늘의 필승 패를 분석해드립니다.
              </Text>
              <Pressable style={styles.primaryButton} onPress={startRecommendation}>
                <Text style={styles.primaryButtonText}>무엇을 낼까?</Text>
              </Pressable>
            </View>
          )}

          {screen === 'loading' && (
            <View style={styles.card}>
              <Text style={styles.title}>분석 중</Text>
              <Text style={styles.loadingEmoji}>🧠</Text>
              <Text style={styles.loadingText}>
                {loadingMessages[loadingIndex]}
              </Text>
              <View style={styles.progressTrack}>
                <View style={styles.progressBar} />
              </View>
            </View>
          )}

          {screen === 'result' && recommendation && (
            <>
              <View style={styles.card}>
                <Text style={styles.kicker}>오늘의 추천</Text>
                <View style={styles.resultImageBox}>
                  <Image
                    source={resultImages[getImageKey(recommendation)][getImageIndexByWinRate(winRate)]}
                    style={styles.resultImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.resultName}>{recommendation.name}</Text>
                <Text style={styles.winRate}>예상 승률 {winRate}%</Text>
                <Pressable style={styles.primaryButton} onPress={startRecommendation}>
                  <Text style={styles.primaryButtonText}>다시 추천받기</Text>
                </Pressable>
              </View>

              <View style={styles.patternCard}>
                <Text style={styles.patternText}>만약 무승부라면,</Text>
                <View style={styles.patternRow}>
                  {drawPattern.map((item, index) => (
                    <View style={styles.patternStep} key={`${item.name}-${index}`}>
                      <View style={styles.patternItem}>
                        <Text style={styles.patternItemText}>{item.emoji}</Text>
                      </View>
                      {index < drawPattern.length - 1 && (
                        <Text style={styles.patternArrow}>→</Text>
                      )}
                    </View>
                  ))}
                </View>
                <Text style={styles.patternText}>패턴을 추천드립니다.</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  appShell: {
    width: '100%',
    maxWidth: 430,
    minHeight: '86%',
    justifyContent: 'center',
  },
  appName: {
    color: '#5A6472',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E3E8EF',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 34,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 4,
  },
  title: {
    color: '#202938',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroEmoji: {
    fontSize: 54,
    marginBottom: 22,
    textAlign: 'center',
  },
  description: {
    color: '#5A6472',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 28,
    textAlign: 'center',
  },
  primaryButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#2F6FED',
    borderRadius: 16,
    paddingVertical: 17,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  loadingEmoji: {
    fontSize: 58,
    marginBottom: 18,
  },
  loadingText: {
    color: '#344054',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 25,
    minHeight: 54,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#E8EEF7',
    borderRadius: 999,
    marginTop: 26,
    overflow: 'hidden',
  },
  progressBar: {
    width: '72%',
    height: '100%',
    backgroundColor: '#2F6FED',
    borderRadius: 999,
  },
  kicker: {
    color: '#2F6FED',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },
  resultImageBox: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultName: {
    color: '#202938',
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 8,
  },
  winRate: {
    color: '#445164',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 28,
  },
  patternCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    borderColor: '#F3D38B',
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 18,
    minHeight: 170,
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  patternText: {
    color: '#5C4630',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  patternRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  patternStep: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  patternItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F3D38B',
    borderRadius: 18,
    borderWidth: 1,
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternItemText: {
    color: '#202938',
    fontSize: 28,
  },
  patternArrow: {
    color: '#9A6B2F',
    fontSize: 22,
    fontWeight: '800',
    marginHorizontal: 8,
  },
});
