좋습니다! **"Neon Night" (다크 모드 + 네온 포인트)** 테마는 앱의 성격(주로 밤과 새벽에 사용)과도 완벽하게 어울리고, 개발자 감성에도 잘 맞는 세련된 선택입니다.

이 테마를 실제 `React Native` 코드에 바로 적용할 수 있도록 **구체적인 컬러 팔레트와 디자인 가이드**를 정리해 드립니다.

---

# 🎨 WakeMate 디자인 가이드: "Neon Night"

## 1. 컬러 팔레트 (Color Palette)

`constants/colors.js` 또는 `theme.js`에 이 값을 복사해서 사용하세요.

| 용도 | 색상명 | Hex Code | 사용 예시 |
| --- | --- | --- | --- |
| **배경 (Main)** | `Deep Charcoal` | **`#121212`** | 전체 화면 배경 (완전 블랙보다 눈이 편안함) |
| **배경 (Card)** | `Surface Grey` | **`#1E1E1E`** | 리스트 아이템, 설정 박스, 모달 배경 |
| **메인 (Primary)** | `Electric Purple` | **`#BB86FC`** | 주요 버튼(친구 추가, 저장), 활성화된 탭 |
| **강조 (Accent)** | `Neon Mint` | **`#03DAC6`** | 스위치 ON 상태, 성공 메시지, 지도 위 내 위치 |
| **경고 (Error/Alarm)** | `Hot Pink` | **`#CF6679`** | **알람 해제 버튼**, 삭제, 연결 끊기, 실패 메시지 |
| **텍스트 (High)** | `White High` | **`#FFFFFF`** | 제목, 주요 내용 (투명도 87% 권장) |
| **텍스트 (Medium)** | `White Medium` | **`#B0B0B0`** | 부가 설명, 비활성화된 텍스트 (투명도 60%) |

---

## 2. 화면별 UI 적용 전략

### A. 로그인 & 메인 (Home)

* **배경:** `#121212` (Deep Charcoal)
* **로고:** 네온 효과가 들어간 텍스트 (CSS `text-shadow` 또는 RN `textShadow` 활용).
* 예: `textShadowColor: '#BB86FC', textShadowRadius: 10`


* **친구 목록:** `#1E1E1E` (Surface Grey) 카드를 사용해 배경과 구분감을 줍니다.
* **상태 표시:** 친구가 '깨어있음' 상태면 프로필 테두리를 `#03DAC6`(민트)으로 빛나게 처리.

### B. 알람 설정 (Controller View)

* **시간 선택기:** 어두운 배경에 흰색 숫자로 깔끔하게.
* **전송 버튼:** 화면 하단에 꽉 차는 `#BB86FC`(퍼플) 버튼.
* 그림자 효과(`elevation` or `shadow`)를 넣어 "누르고 싶게" 만듭니다.



### C. 알람 수신 & 해제 (Receiver View - 중요!)

* **배경:** 평소엔 다크하지만, **알람이 울릴 땐** `#121212`와 `#CF6679`(핫핑크)가 **0.5초 간격으로 번갈아 바뀌는(Blinking)** 애니메이션을 적용하세요. 시각적 긴급함을 줍니다.
* **해제 버튼/미션:** 배경이 어두우므로 버튼은 아주 밝은 색(`Border`만 흰색이거나, 배경이 `#CF6679`)을 써서 잘 보이게 합니다.

### D. 위치 공유 (Map View)

* **지도 스타일:** Google Maps의 **"Dark Mode"** JSON 스타일을 적용해야 앱 테마와 이질감이 없습니다.
* *팁:* `react-native-maps`에 `customMapStyle` 속성으로 다크 테마 JSON을 넣을 수 있습니다. (Snazzy Maps 사이트 참고)


* **마커:**
* **나:** `#03DAC6` (민트색) 원형 마커 + 은은한 퍼짐 효과.
* **친구:** 친구 프로필 사진 + `#BB86FC` (퍼플) 테두리.



---

## 3. 개발 팁: React Native용 테마 객체 예시

`theme.js` 파일을 만들고 아래 코드를 넣어두면, 나중에 색상을 한 번에 바꾸기 편합니다.

```javascript
// src/constants/theme.js

export const NEON_THEME = {
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#BB86FC',
    secondary: '#03DAC6',
    error: '#CF6679',
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    border: '#2C2C2C',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  // 네온 효과 스타일 미리 정의
  neonGlow: {
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5, // Android
  }
};

```

**"Neon Night"** 테마 확정되었으니, 이제 프로젝트 생성(`npx create-expo-app`)하고 배경색부터 `#121212`로 까맣게 칠하고 시작하시면 되겠네요! 혹시 로고나 아이콘 디자인 아이디어도 필요하시면 말씀해 주세요.