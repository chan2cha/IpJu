# 우리집 입주노트 — 신축아파트 입주 준비 공동 체크리스트 & 자금계획 PWA

> 버전: 0.1 / 상태: MVP 기획 / 대상: 부부 2인 / 언어: 한국어 / 통화: KRW / 시간대: Asia/Seoul

## 1. 제품 개요

### 목적
신축아파트 입주를 앞둔 부부가 대출, 잔금, 세금, 가전, 가구, 이사 등의 **해야 할 일**과 **들어갈 돈**을 모바일에서 함께 관리한다.

### 제품의 한 문장 정의
"지금 무엇을 준비해야 하고, 언제 얼마가 나가고, 돈은 얼마나 부족한지"를 한눈에 확인하는 **2인 전용 입주 준비 앱**.

### UX 원칙
- 하루에 1~2번, 1분 이내에 빠르게 확인·수정할 수 있을 것.
- 스마트폰 화면(최소 360px) 최우선; 엄지손가락으로 조작하기 편한 큰 터치 영역(44px 이상 권장).
- 가계부, 일정관리, 쇼핑몰을 모두 만들지 않는다. 입주 준비 목적에 집중한다.
- 금액을 입력할 때는 숫자 키패드, 천 단위 구분, '원' 표시를 제공한다.
- 신규 항목 등록은 최소 입력 필드만 요구하고 나머지는 선택 사항으로 둔다.
- 배우자와 변경 사항이 자연스럽게 공유되며, 수정한 사람이 표시되면 좋다.

## 2. 사용자와 공유 방식
- 사용자: 본인 + 배우자, 각자의 계정으로 로그인.
- 단위: 하나의 `household`(우리집 공간)을 두 사람이 공유한다.
- 소유자가 공간을 만들고 초대 링크를 전송한다. 초대받은 사람이 로그인 후 수락하면 멤버가 된다.
- MVP 권한: owner/member 모두 체크리스트와 자금계획 조회·편집 가능. 멤버 초대/제거는 owner만.
- 서비스 전체에 공개된 지출 목록, 검색 엔진 노출, 익명 데이터 조회는 허용하지 않는다.

## 3. MVP 기능 범위

### A. 홈 대시보드 (`/dashboard`)
- 입주일까지 D-Day 표시.
- 미완료 할 일 개수 / 일주일 내 마감 항목 / 최근 변경 사항 간단 요약.
- 자금 요약 카드: 예상 총지출 / 총 조달 예정자금 / 예상 부족액(또는 여유액) / 현재까지 결제액.
- '할 일 추가', '지출 추가' 바로가기.

### B. 공동 체크리스트 (`/tasks`)
- 카테고리: 대출·금융, 입주·등기·세금, 가전, 가구·인테리어, 이사, 생활·행정, 기타.
- 항목 속성: 제목(필수), 설명, 담당자, 마감일, 상태(todo/in_progress/done), 우선순위, 카테고리.
- 필터: 전체 / 내 담당 / 미완료 / 완료 / 카테고리.
- 항목 생성·수정·완료 체크·삭제(삭제 전 확인).
- 기본 템플릿 불러오기(중복 추가 방지; 사용자가 선택 가능).

### C. 지출 계획 (`/expenses`)
- 항목 속성: 품목/목적(필수), 카테고리, 예상금액, 확정금액(선택), 결제예정일, 메모, 링크, 담당자.
- 실제 지급은 별도 결제 기록에 입력: 금액, 결제일, 간단 메모.
- 항목별: 계획금액(확정금액이 있으면 확정, 없으면 예상), 누적 결제액, 남은 결제액 표시.
- 카테고리별 합계, 결제예정일 순 정렬, 선택 필터.
- 부분 결제 지원: 계약금·중도금·잔금 등을 여러 건 입력.
- 확정금액을 모르면 '미정'으로 표시. 입력되지 않은 금액을 0원으로 확정한 것처럼 오해시키지 않기.

### D. 자금 계획 (`/funding`)
- 조달원 추가: 현재 준비된 자기자금, 대출, 기타 유입 예정자금.
- 속성: 이름, 유형(cash/loan/other), 금액, 사용 가능 예정일, 상태(planned/confirmed/received), 메모.
- 대출은 자금 유입으로만 계산(금융 비용/상환 계획은 MVP 제외). 담보대출 원리금과 대출금액을 혼합하지 않는다.
- '예상 총자금', '확정 또는 수령 자금'을 별도 표시한다.
- 중요한 고지: 이는 계획 계산표이며 실제 계좌잔액 자동 조회가 아니다.

### E. 설치형 PWA 및 모바일 UX
- Next.js App Router의 `manifest.ts`, 아이콘(192/512), standalone 모드, 모바일 앱 같은 하단 탭.
- HTTPS 환경에서 홈 화면 추가 지원. iPhone은 Safari 공유 메뉴의 '홈 화면에 추가' 사용 안내.
- 로그인·민감한 금액이 표시되는 API 응답을 공개 캐시하지 않는다.
- **MVP는 온라인 사용이 기본**. 오프라인 작성·동기화·푸시 알림은 다음 단계에서 검토.
- 최하단 모바일 탭: 홈 / 할 일 / 지출 / 자금. 설정은 홈 메뉴로 접근.

### F. 계정/환경설정 (`/settings`)
- 로그인·로그아웃, 입주예정일 변경, 구성원 보기·초대, 간단한 앱 설치 안내.
- 데이터 내보내기(CSV)는 후속 개선; MVP에서 백업·복구 운영 방안은 문서화.

## 4. MVP에서 제외할 것
- 은행 API 연동, 카드·계좌 자동 조회, 대출 금리 비교 또는 대출 한도 계산.
- OCR 영수증 인식, 구매 추천, 쇼핑몰 가격 추적.
- 복잡한 프로젝트 의존성, 캘린더 양방향 연동, 채팅.
- 범용 다가구 SaaS 운영, 결제/구독, 외부 사용자 초대 검색.
- 오프라인 쓰기/동기화 충돌 해결, Web Push, 데스크톱 설치 전용 기능.

## 5. 화면 구조 및 주요 동선

```text
최초 접속
  └─ 로그인 / 회원가입
        ├─ 공간 생성 → 입주예정일 설정 → 기본 체크리스트 불러오기
        └─ 초대 링크 수락 → 기존 공간 입장

[하단 탭] 홈 | 할 일 | 지출 | 자금
  홈 ── D-Day, 부족액, 곧 할 일, 빠른 추가
  할 일 ── 목록/필터 → 상세/편집 → 완료 체크
  지출 ── 카테고리별/날짜별 지출 → 항목 상세 → 결제 기록 추가
  자금 ── 확보 자금 목록 → 자금 추가/수정
```

### 홈 화면 간단 와이어프레임

```text
┌────────────────────────────┐
│ 우리집 입주노트         ☰ │
│ 입주까지 D-45              │
│                            │
│ 예상 총지출    3억 5,000만 │
│ 총 조달 예정  3억 4,000만 │
│ 예상 부족액      1,000만 │
│ 이미 결제한 돈       500만 │
│                            │
│ 이번 주 할 일  3건         │
│ □ 대출서류 준비            │
│ □ 이사업체 견적 비교       │
│                            │
│   [+ 할 일]  [+ 지출]      │
├────────────────────────────┤
│  홈    할 일   지출   자금 │
└────────────────────────────┘
```

> 숫자들은 UI 예시용 가상 데이터.

## 6. 데이터 모델 제안

### `households`
- `id` uuid PK
- `name` text NOT NULL
- `move_in_date` date NOT NULL
- `created_by` uuid FK auth.users
- `created_at`, `updated_at` timestamptz

### `household_members`
- `household_id` uuid FK households
- `user_id` uuid FK auth.users
- `role` enum(owner, member)
- `created_at` timestamptz
- UNIQUE(household_id, user_id)

### `household_invites`
- `id` uuid PK, `household_id` uuid FK
- `token_hash` text UNIQUE (초대 원문 토큰 저장 금지)
- `expires_at` timestamptz, `used_at` timestamptz NULL
- `created_by` uuid FK auth.users
- 서버에서만 발급·검증·소비. 충분히 난수성이 있는 단발성 토큰, 만료 및 재사용 차단.

### `tasks`
- `id` uuid PK, `household_id` uuid FK
- `title` text NOT NULL, `description` text NULL
- `category` text NOT NULL, `status` text CHECK(todo,in_progress,done)
- `priority` text CHECK(low,normal,high)
- `assignee_user_id` uuid NULL, `due_date` date NULL
- `template_key` text NULL (템플릿 중복 확인용)
- `created_by`, `updated_by` uuid, `created_at`, `updated_at` timestamptz

### `expense_items`
- `id` uuid PK, `household_id` uuid FK
- `title` text NOT NULL, `category` text NOT NULL
- `estimated_amount_krw` bigint NULL CHECK(>=0)
- `confirmed_amount_krw` bigint NULL CHECK(>=0)
- `due_date` date NULL, `memo` text NULL, `reference_url` text NULL
- `assignee_user_id` uuid NULL
- `created_by`, `created_at`, `updated_at` timestamptz

### `expense_payments`
- `id` uuid PK, `household_id` uuid FK, `expense_item_id` uuid FK
- `amount_krw` bigint NOT NULL CHECK(amount_krw>0)
- `paid_on` date NOT NULL, `memo` text NULL
- `created_by` uuid FK, `created_at` timestamptz
- 무결성: 결제 기록의 `household_id`와 부모 지출 항목의 `household_id`가 항상 일치하도록 복합 FK 또는 DB 트리거/권한 정책으로 검증.

### `funding_sources`
- `id` uuid PK, `household_id` uuid FK
- `name` text NOT NULL, `source_type` text CHECK(cash,loan,other)
- `amount_krw` bigint NOT NULL CHECK(amount_krw>=0)
- `available_on` date NULL
- `status` text CHECK(planned,confirmed,received)
- `memo` text NULL, `created_by` uuid, `created_at`, `updated_at` timestamptz

### 인덱스
- 자주 조회하는 테이블에 `household_id` 인덱스.
- `tasks(household_id,status,due_date)`, `expense_items(household_id,due_date)`, `expense_payments(expense_item_id)`, `funding_sources(household_id)`.

## 7. 자금 계산 규칙 (중요)

화면에 표시되는 자금은 별도 정의를 지킨다.

1. 각 지출항목의 `계획금액` = 확정금액이 있으면 확정금액, 그렇지 않으면 예상금액. 둘 다 미정인 항목은 총합에서 제외하면서 '금액 미정 N건'을 별도 표시.
2. `예상 총지출` = 모든 지출 항목의 계획금액 합계. (이미 결제한 금액 포함)
3. `총 결제액` = 모든 결제 기록의 합계.
4. `남은 결제 예정액` = 항목마다 `max(계획금액 - 총 결제액, 0)`을 계산해 합산. 실제 결제액이 계획금액보다 커진 경우 '초과 지출' 경고를 별도 표시.
5. `예상 총자금` = 모든 자금 조달 항목 금액의 합계. 예정 대출 포함.
6. `확정·수령 자금` = 상태가 confirmed 또는 received인 조달 항목 금액의 합계.
7. `예상 자금 차이` = 예상 총자금 - 예상 총지출. 음수면 부족액, 양수면 여유액.
8. `확정 기준 자금 차이` = 확정·수령 자금 - 예상 총지출. '확정 기준'의 보수적 참고치이며 실제 현금 잔고가 아님.
9. `실제 남은 계좌잔액`이라는 명칭은 사용 금지. 은행 연동이 없으므로 계산할 수 없음.
10. 원화 금액은 DB bigint(integer KRW) 저장. JS에서 안전 정수 범위를 벗어나면 명시적으로 오류 처리하거나 decimal/BigInt 경계 변환 사용. 통상 가정 규모라도 서버 검증 필수.
11. 결제 기록은 '총 예상지출'에서 다시 차감하면 안 됨. 총지출은 이미 결제분을 포함.
12. 0원과 미입력(NULL)을 구분.

### 예시 계산 테스트
- 예상 지출: 잔금 1,500,000원 + 가전 2,000,000원 = 3,500,000원.
- 조달 자금: 자기자금 1,000,000원 + 대출 2,000,000원 = 3,000,000원.
- `예상 부족액` = 500,000원.
- 가전에 500,000원 부분 결제 시 `총 결제액` = 500,000원, `남은 결제 예정액` = 3,000,000원.
- 부분 결제 후에도 `예상 부족액`은 **500,000원 그대로**(이미 결제된 돈을 두 번 차감하지 않음).

## 8. 기본 체크리스트 템플릿

카테고리별 예시(사용자가 추가 전에 선택 가능):

| 카테고리 | 템플릿 할 일 |
|---|---|
| 대출·금융 | 대출 조건 비교, 대출 가능 금액 확인, 제출 서류 준비, 대출 신청, 승인 확인, 실행일 점검 |
| 입주·등기·세금 | 잔금 납부 일정 확인, 관리비예치금 확인, 취득세 및 등기 비용 확인, 사전점검/하자 보수 확인, 입주 예약, 열쇠 인수 |
| 가전 | 냉장고 검토, 세탁기·건조기 검토, 에어컨 설치 일정 확인, 식기세척기 검토, 설치일 조율 |
| 가구·인테리어 | 침대, 소파, 식탁, 커튼·블라인드, 수납장·붙박이장 견적 |
| 이사 | 이사업체 비교견적, 이사 날짜 확정, 계약, 이사 전 폐기물 정리, 입주청소 예약 |
| 생활·행정 | 인터넷 설치 예약, 전입신고 일정 확인, 주소지 변경, 도시가스·전기 확인, 관리사무소 안내 확인 |

> 행정·세금 항목은 필요한 일을 놓치지 않도록 돕는 예시이며 법률·세무 자문을 대체하지 않는다.

## 9. 추천 기술 스택

| 구역 | 선택 | 이유 |
|---|---|---|
| 프론트/서버 | Next.js(App Router) + TypeScript | 한 프로젝트에서 UI, 서버 작업, PWA 구성 |
| UI | Tailwind CSS + shadcn/ui | 모바일 화면 빠르게 구성하고 일관성 유지 |
| DB | Supabase PostgreSQL | 개인 프로젝트 규모에 적합한 관리형 DB |
| 인증 | Supabase Auth | 두 계정 로그인 및 세션 관리 |
| 접근 제어 | PostgreSQL RLS | 가구에 속한 데이터만 읽고 쓰도록 강제 |
| 데이터 동기화 | Supabase Realtime (필요한 화면만) | 배우자 수정 내용 반영 |
| 배포 | Vercel + Supabase | 인터넷에서 두 사람이 동일한 HTTPS 앱 이용 |
| 품질 | ESLint + TypeScript + Vitest + Playwright | 정적 확인, 계산 테스트, 모바일 흐름 자동화 |

### 배포 선택의 이유
- 배우자가 외부에서도 접속해야 하므로, 로컬 PC/NAS에서만 실행하면 접근·HTTPS·백업·운영에 제약이 있다.
- 초기에는 **Vercel + Supabase**로 만들고, 향후 필요하면 **Docker + Next.js + PostgreSQL**로 이전 가능한 구조를 유지한다.
- 실제 비용/무료 요금제 제한은 배포 직전에 각 공식 사이트에서 확인한다.

## 10. 보안 및 운영 요구사항
- 모든 사용자별 데이터 테이블에 RLS 적용. 비회원·다른 household 소속은 조회·수정 불가.
- 서버 액션/라우트에서도 로그인 및 household 소속 여부 재검증. 단순 클라이언트 필터링으로 권한을 대체하지 않는다.
- 비밀 서버 키를 프론트 코드, Git, 콘솔 로그, 오류 메시지에 넣지 않는다.
- 회원가입·초대 링크는 rate limiting 및 만료/단발성 소비 검토.
- 금액/날짜/URL은 서버 검증(Zod 권장). 입력 문자열 길이 제한.
- 타인이 URL의 id를 바꿔도 데이터가 보이거나 수정되지 않아야 한다(수평 권한 상승 방지).
- 데이터 백업/복구를 실사용 전 확인; 지출정보 수정/삭제 실수 방지를 위한 삭제 확인.
- Realtime 채널도 멤버십 기준으로 접근 제어. 비공개 데이터 공개 채널 전송 금지.
- PWA 캐시는 빌드 산출물/정적 자산 중심. 인증된 금융 데이터 응답은 무분별하게 offline cache하지 않음.
- 성능: 첫 화면에서 모든 결제 내역을 전부 내려받지 말고 필요한 집계/페이징 사용. 개인정보가 필요한 로그는 최소화.

## 11. 구현 순서 (한 번에 전부 구현하지 않기)

### Milestone 1 — UI/모델 확인 (백엔드 연결 전)
1. Next.js + TypeScript + Tailwind + shadcn/ui 초기화.
2. 모바일 하단 탭, 홈/할 일/지출/자금/설정 페이지 구현.
3. **가상 데이터**를 이용해 화면 구성. 목록·모달/시트·입력폼의 사용성 먼저 확인.
4. 자금 계산을 `lib/finance.ts` 순수 함수로 분리하고 Vitest 테스트 작성.
5. TypeScript, lint, tests 통과. UI 캡처/수동 검토.

**완료 기준**: 360px 모바일 화면에서 레이아웃 깨짐 없이 4개 탭을 탐색하고 예시 금액이 올바르게 보임.

### Milestone 2 — DB/인증/공유
1. Supabase 프로젝트 및 환경변수 설정.
2. SQL migration으로 테이블/제약조건/인덱스 및 RLS 구현.
3. 이메일 로그인/가입, household 생성, 초대 링크 수락.
4. 각자의 계정으로 같은 가구 데이터를 조회할 수 있는지 확인.
5. 제3자 계정에서는 아무 데이터도 조회/수정할 수 없는지 보안 테스트.

**완료 기준**: 본인·배우자는 동일한 공간 접근, 비멤버는 접근 불가.

### Milestone 3 — 실제 CRUD
1. 할 일 생성/수정/완료/삭제.
2. 지출 생성/수정/삭제 및 분할 결제 기록 생성/수정/삭제.
3. 자금원 생성/수정/삭제.
4. 대시보드 집계 및 완료/임박 필터링.
5. 서버 검증 및 오류 처리, 빈 상태/로딩 UI.
6. 동시 수정 시 합리적인 최신 상태 반영(기본은 저장 시점 최신값, 충돌 위험 문서화).

**완료 기준**: 두 사람이 같은 데이터를 각각 추가하고 새로고침해도 일관성 있게 보임.

### Milestone 4 — PWA/실사용 검수
1. manifest/아이콘/앱 테마 및 HTTPS 배포.
2. iPhone Safari, Android Chrome에서 홈 화면 설치 확인.
3. 모바일 폼·한국어 숫자 표기·날짜/시간대 검수.
4. 대표 2인 E2E 및 권한 테스트.
5. README에 운영/백업/배포 절차 추가.

**완료 기준**: 각자의 휴대폰 홈 화면에서 앱을 실행하고 대출·가전·이사 항목을 함께 관리 가능.

## 12. 테스트 및 수용 기준

### 단위 테스트 (Vitest)
- 예상금액/확정금액 우선순위, 0원과 NULL 차이.
- 분할 결제 누적, 초과 결제 경고, 결제액 중복 차감 방지.
- 조달원 planned/confirmed/received 합계 분리.
- 원화 포맷, 날짜 D-Day 계산(Asia/Seoul 달력 기준).

### 통합/보안 테스트
- 본인, 배우자, 제3자 각각의 데이터 조회/수정 결과.
- 다른 household의 task/expense/payment ID로 위조 요청 시 거부.
- 초대 링크 만료·중복 사용·로그인 전 접근·타인 사용 처리.
- 부정확한 금액(음수, 소수, 너무 큰 값) 및 날짜 값 거절.
- 결제 기록이 다른 household 지출로 붙는 것 차단.

### E2E (Playwright)
- 회원가입 → 공간 생성 → 입주일 설정 → 템플릿 선택.
- 할 일 추가 → 담당자 지정 → 배우자가 완료 처리 → 사용자 화면 갱신.
- 지출 추가 → 확정금액 수정 → 부분 결제 기록 → 대시보드 집계 확인.
- 자금원 추가 → 예상 부족액 변화 확인.
- 모바일 360x800 및 390x844 뷰포트 점검.

## 13. 성능/복잡도 관리
- V1은 입주 준비 개인 도구다. 마이크로서비스/큐/캐시 서버/복잡한 상태 관리 라이브러리 도입 금지.
- 네트워크 로딩 및 데이터 미존재 화면을 분리해 UI가 빈 상태에서도 사용 가능하게 함.
- 목록은 household별 필터 후 조회하고 필요한 컬럼만 선택한다.
- 계산 로직은 React 컴포넌트에서 직접 중복 작성하지 않는다.
- 개인정보를 포함한 화면에서는 검색엔진 인덱싱 방지와 보안 헤더 검토.

## 14. 이후 개선안 (사용 후 필요할 때만)
- 날짜별 자금 유입/지출 캘린더와 현금 흐름 시뮬레이션.
- 계약금/중도금/잔금 단계별 예정 알림.
- 품목별 견적 비교(매장/상품/금액/URL), 구매후보 북마크.
- 사진·견적서 첨부, 영수증 보관.
- CSV/엑셀 내보내기, 삭제 복원, 변경 이력.
- 푸시 알림과 오프라인 조회/입력 지원.
- 입주 후 생활비·대출 상환 관리 모듈.

## 15. Codex CLI에 처음 맡길 작업

아래 요청은 프로젝트 루트에 이 문서와 `AGENTS.md`를 두고 실행한다.

```text
PROJECT_PLAN.md와 AGENTS.md를 읽고 Milestone 1만 구현해줘.

조건:
1. Next.js(App Router), TypeScript, Tailwind, shadcn/ui 기반으로 초기화.
2. 한국어 모바일 우선 UI를 구현하고, 하단 탭은 홈/할 일/지출/자금.
3. 실제 DB/로그인 연결은 하지 말고 가상 데이터로 동작하는 시제품을 만들 것.
4. 자금 계산 함수를 lib/finance.ts로 분리하고 Vitest 단위 테스트 작성.
5. 반응형 화면에서 금액/날짜 표시, 빈 상태, 로딩 UI를 고려할 것.
6. 작업 종료 전 lint/typecheck/test 실행하고 오류를 수정할 것.
7. 파일 구조, 실행 명령, 테스트 결과, 다음 단계 예상 작업을 요약할 것.
8. 다른 milestone을 무단으로 구현하지 말 것.
```

---

### 참고 문서
- Next.js PWA: https://nextjs.org/docs/app/guides/progressive-web-apps
- Supabase Next.js Quickstart: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Codex CLI: https://github.com/openai/codex
