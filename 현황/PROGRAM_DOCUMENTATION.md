# WakeMate 프로그램 기술 문서 (Technical Documentation)

## 1. 개요 (Overview)
**WakeMate**는 사용자가 서로의 기상을 돕고 위급 시 위치를 공유할 수 있는 **React Native (Expo)** 기반의 모바일 애플리케이션입니다. **Supabase**를 백엔드로 사용하여 실시간 데이터 동기화를 지원하며, **"Neon Night"** 디자인 시스템을 통해 일관되고 세련된 다크 모드 UI를 제공합니다.

---

## 2. 시스템 아키텍처 (System Architecture)

### 2.1 기술 스택 (Tech Stack)
| 분류 | 기술 | 비고 |
| :--- | :--- | :--- |
| **Frontend** | React Native (0.81), Expo (SDK 54) | Cross-platform (Android, iOS, Web) |
| **Language** | TypeScript | 정적 타입 안정성 확보 |
| **Backend** | Supabase | Auth, Database (PostgreSQL), Realtime |
| **State** | Zustand | 전역 상태 관리 (Session, Profile) |
| **Navigation** | React Navigation v6 | Stack & Tab Navigation |
| **UI/Style** | StyleSheet, Crypto/Neon Theme | Custom "Neon Night" Theme |

### 2.2 디렉토리 구조 (Directory Structure)
```
src/
├── components/      # 재사용 가능한 UI 컴포넌트 (GlobalAlarmListener 등)
├── constants/       # 상수 및 설정 값 (theme.js 등)
├── navigation/      # 네비게이션 설정 (RootNavigator.tsx)
├── screens/         # 화면 단위 컴포넌트
│   ├── LoginScreen          # 인증
│   ├── AlarmControllerScreen # 알람 송신
│   ├── AlarmReceiverScreen   # 알람 수신 (테스트용)
│   ├── FriendListScreen      # 친구 관리
│   └── MapScreen            # 위치 확인
├── lib/             # 외부 라이브러리 래퍼 (supabase.ts, audio.ts)
└── store/           # Zustand 상태 스토어 (authStore.ts)
```

---

## 3. 핵심 모듈 상세 (Core Modules)

### 3.1 인증 모듈 (Authentication)
*   **담당 파일**: `src/store/authStore.ts`, `src/screens/LoginScreen.tsx`
*   **기능**:
    *   Supabase Auth를 이용한 이메일/비밀번호 로그인 및 회원가입.
    *   앱 실행 시 자동 로그인 (Session Persistence).
    *   로그인 후 `profiles` 테이블에서 사용자 추가 정보 로드.

### 3.2 알람 엔진 (Alarm Engine)
*   **담당 파일**: `src/components/GlobalAlarmListener.tsx`, `src/lib/audio.ts`
*   **작동 원리**:
    1.  **송신**: 사용자가 `alarms` 테이블에 `INSERT` (receiver_id 지정).
    2.  **수신**: `GlobalAlarmListener`가 Supabase Realtime 채널을 통해 `INSERT` 이벤트 감지.
    3.  **실행**: 알람 데이터(`pending` 상태) 수신 시, `Modal`을 띄우고 `expo-av`로 오디오 재생.
    4.  **해제**: 사용자가 알람 해제 시 `alarms` 상태를 `success`로 업데이트하고 오디오 중지.
*   **특이 사항**: `expo-av`의 `playsInSilentModeIOS` 설정을 통해 무음 모드에서도 강제 재생.

### 3.3 웹 호환성 레이어 (Web Compatibility Layer)
*   **문제**: `react-native-maps` 등 일부 네이티브 모듈이 웹을 지원하지 않음.
*   **해결**: 파일 확장자 분기(`MapScreen.web.tsx`, `MapScreen.tsx`)를 통해 플랫폼별 컴포넌트 로드.
*   **의존성 관리**: `lucide-react-native` 등 웹 호환성 문제가 있는 패키지를 표준 패키지(`@expo/vector-icons`)로 교체.

---

## 4. 데이터베이스 설계 (Database Constraints)

### 4.1 스키마 개요 (Schema)
*   **profiles**: 사용자 정보 관리 (Auth Users와 1:1 매핑).
    *   `id` (PK, FK), `username`, `display_name`, `fcm_token`
*   **alarms**: 알람 트랜잭션 기록.
    *   `id` (PK), `sender_id` (FK), `receiver_id` (FK), `status` (pending/success/missed), `created_at`

### 4.2 보안 정책 (Row Level Security)
*   모든 테이블에 RLS 적용.
*   **profiles**: 본인 데이터만 수정 가능, 공개 프로필은 누구나 조회 가능.
*   **alarms**: 본인이 받거나 보낸 알람만 조회/수정 가능.

---

## 5. 실행 환경 (Environment)
*   **필수 환경 변수 (.env)**:
    *   `EXPO_PUBLIC_SUPABASE_URL`
    *   `EXPO_PUBLIC_SUPABASE_ANON_KEY`
*   **실행 명령어**:
    *   `npm install` (의존성 설치)
    *   `npx expo start -c` (캐시 초기화 포함 실행)

---

## 6. 향후 확장 계획 (Roadmap)
*   **친구 기능**: Friend Request/Accept 워크플로우 구현.
*   **FCM 연동**: 앱이 꺼져있을 때도 알람을 받을 수 있도록 Firebase Cloud Messaging 연동 (Notifee 활용).
*   **위치 추적**: Background Location Task를 통한 실시간 위치 공유 기능.
