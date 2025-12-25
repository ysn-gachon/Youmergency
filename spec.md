지금까지 논의된 모든 핵심 기능(원격 제어, 무음 모드 우회, 위치 기반 이동 인증)과 **수익 모델(유료 플랜)**까지 포함한 **WakeMate(가칭) 앱 개발 최종 명세서**입니다.

이 문서는 개발자가 프로젝트를 착수(Kick-off)할 때 바로 참고할 수 있는 수준으로 작성되었습니다.

---

# 📱 Project Spec: WakeMate (가칭)

## 1. 프로젝트 개요 (Overview)

* **목표:** 친구, 가족, 연인이 서로의 기상을 책임지는 원격 알람 및 기상 후 이동 인증 서비스.
* **Core Value:** "절대 못 일어나는 사람은 없다. 깨워주는 사람이 없을 뿐."
* **플랫폼:** iOS / Android (React Native Expo Development Build)
* **주요 특징:**
1. **원격 제어:** 상대방 폰의 알람을 내가 생성.
2. **무음 무시:** 상대방 폰이 매너 모드여도 강제로 소리를 울림.
3. **이동 인증:** 기상 후 실제로 이동 중인지 실시간 위치 추적.



---

## 2. 수익화 전략 (Monetization Strategy)

서버 비용(지도 API, 데이터베이스 부하)과 사용자 경험 차별화를 기준으로 무료/유료 플랜을 나눕니다.

| 구분 | **Free Plan (기본)** | **Pro Plan (월 구독형)** |
| --- | --- | --- |
| **친구 연동** | 최대 1명 (커플/절친 전용) | **무제한** (가족, 스터디 그룹 등) |
| **알람 소리** | 기본 제공 사운드 (사이렌 등) | **TTS 음성 메시지** ("일어나! 00아!")<br>

<br>또는 **목소리 녹음 전송** |
| **위치 추적** | 기상 직후 10분만 공유 | **최대 1시간 공유 + 도착 알림** |
| **광고** | 배너 광고 노출 | **광고 제거** |
| **미션** | 기본 (터치, 흔들기) | **고급 미션** (바코드 찍기, 수학 문제) |

---

## 3. 기술 스택 (Tech Stack)

### Frontend

* **Framework:** **React Native (Expo Dev Client)**
* *이유:* `Notifee`, `Google Sign-In` 등 Native Module 사용 필수.


* **State Management:** **Zustand** (가볍고 빠른 전역 상태 관리)
* **Map/Location:** `react-native-maps`, `expo-location`

### Backend & Infrastructure

* **BaaS:** **Supabase** (PostgreSQL)
* *Auth:* 사용자 인증
* *Database:* 데이터 저장
* *Realtime:* 알람 즉시 실행 및 위치 실시간 동기화


* **Cloud Messaging:** **Google FCM** (앱이 꺼져있을 때 깨우기 위함)
* **Edge Functions:** Supabase Edge Functions (FCM 전송, 결제 검증 로직 처리)

### Critical Libraries (핵심)

* **Notification:** `@notifee/react-native` (안드로이드 알람 채널 제어의 핵심)
* **Audio:** `expo-av` (iOS 오디오 세션 제어)
* **Payment:** `revenuecat` (인앱 결제 구현 용이)

---

## 4. 상세 기능 명세 (Feature Specifications)

### A. 인증 및 설정 (Auth & Settings)

1. **Google 로그인:** Supabase Auth + Google OAuth.
2. **프로필:** 닉네임, 프로필 사진, **UID 코드(친구 추가용)**.
3. **권한 제어 (Master Switch):** "지금부터 알람 허용" 토글. (OFF 상태면 친구가 알람을 보내도 무시).

### B. 알람 시스템 (The "Wake-up" Core)

* **Sender (보내는 사람):**
* 알람 시간, 반복 여부 설정.
* (Pro) 텍스트 입력 시 TTS로 변환하여 전송 ("야! 3번 버스 놓친다!").


* **Receiver (받는 사람) - 무음 모드 우회 로직:**
* **Android:**
* `Notifee`를 사용해 `Importance.HIGH` 및 `AndroidCategory.ALARM` 채널 생성.
* `fullScreenAction`으로 잠금 화면 위에 알람 UI 즉시 띄움.


* **iOS:**
* `expo-av`의 `AudioSession`을 `Playback` 모드로 설정 + `playsInSilentModeIOS: true`.
* 앱이 백그라운드면 Push 알림 클릭 유도 -> 앱 진입 순간 소리 재생. (추후 CallKit 도입 고려).




* **알람 해제 미션:**
* 흔들기 (가속도 센서), 숫자 입력 등 수행 후 소리 중단.



### C. 이동 인증 (Commute Verification) - Pro 기능 강화

1. **시나리오:** 알람 해제 후 "이동 인증을 시작하시겠습니까?" 팝업.
2. **Receiver:**
* 백그라운드 위치 추적 시작 (`startLocationUpdatesAsync`).
* 배터리 효율을 위해 30초~1분 간격으로 좌표 업데이트.


3. **Controller:**
* 지도 화면에서 친구의 아이콘이 실시간으로 움직이는 것 확인 (Supabase Realtime).
* 친구가 10분 이상 한 지점에 멈춰있으면 "다시 잠듦?" 경고 알림 전송 기능.



---

## 5. 데이터베이스 스키마 (Supabase)

### 5.1 `profiles`

* `id` (uuid): PK
* `email`, `display_name`
* `fcm_token` (text): 알람 수신용
* `is_pro` (bool): **유료 플랜 가입 여부**
* `alarm_permission` (bool): 알람 수신 허용 여부

### 5.2 `connections` (친구 관계)

* `id` (uuid)
* `user_id` (uuid), `friend_id` (uuid)
* `created_at`

### 5.3 `alarms`

* `id` (uuid)
* `sender_id`, `receiver_id`
* `trigger_time` (timestamp)
* `message` (text): 알람 문구
* `message_type` (text): 'default' | 'tts' | 'voice'
* `status`: 'pending' | 'ringing' | 'success' | 'failed'

### 5.4 `tracking_sessions` (위치 공유)

* `id` (uuid)
* `user_id` (Receiver)
* `viewer_id` (Controller)
* `current_lat`, `current_lng`
* `updated_at` (timestamp)
* `is_active` (bool)

---

## 6. 개발 로드맵 (Milestones)

### Phase 1: MVP (핵심 기능 검증) - 2주

* [ ] Supabase 연동 및 Google 로그인.
* [ ] **[핵심]** 버튼 하나 누르면 내 폰에서 무음 모드를 뚫고 소리가 나는지 검증 (Notifee/Expo AV).
* [ ] 1:1 친구 연결 로직 구현.
* [ ] FCM을 통한 단순 알람 트리거.

### Phase 2: 위치 및 미션 (기능 확장) - 2주

* [ ] **[핵심]** 지도(Map) 연동 및 내 위치 표시.
* [ ] 백그라운드 위치 좌표 Supabase 전송 테스트.
* [ ] 알람 해제용 '흔들기' 미션 구현.

### Phase 3: Pro 플랜 및 고도화 - 2주

* [ ] Google TTS API 연동 (유료 기능).
* [ ] 인앱 결제(RevenueCat) UI 및 로직.
* [ ] 디자인 폴리싱 및 예외 처리 (배터리 최적화 안내 등).

---

## 7. 개발 시 주의사항 (Risk Management)

1. **Google Maps 비용:**
* Android/iOS용 SDK는 무료이나, 추후 웹 기반 대시보드를 만들거나 Geocoding 등을 사용하면 비용이 발생합니다. 초기에는 Native SDK 기능만 활용하세요.


2. **iOS 심사 리스크:**
* "백그라운드 위치 추적"과 "알람 기능"은 애플 심사에서 까다롭게 보는 영역입니다. 앱 설명에 **"친구가 깨워주는 알람 및 등교 확인을 위해 위치가 필요함"**을 명확히 소명해야 합니다.


3. **Supabase Realtime 사용량:**
* 위치 정보를 너무 자주(예: 1초마다) DB에 쓰면 Supabase 무료 티어 한도를 넘을 수 있습니다. **30초~1분 간격**으로 조절하거나, 이동 거리가 50m 이상일 때만 업데이트하는 로직이 필요합니다.



---

이 명세서는 **1인 개발 또는 소규모 팀**이 React Native와 Supabase를 활용해 가장 빠르게, 그러면서도 **수익성 있는** 앱을 만들기 위한 최적의 설계를 담고 있습니다.

**가장 먼저 해야 할 일:**
`npx create-expo-app`으로 프로젝트를 생성하고, `Notifee`를 설치하여 **"소리 나게 하기"**부터 성공시키세요!