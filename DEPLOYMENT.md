# Supabase + GitHub + Vercel 연결

## 연결 대상

- GitHub: https://github.com/chan2cha/IpJu.git
- Supabase 프로젝트: https://supabase.com/dashboard/project/mtmtjfbarvbhdmiyfqtr
- Supabase API 기본 주소: `https://mtmtjfbarvbhdmiyfqtr.supabase.co`
- Vercel 프로젝트: 아직 확인되지 않음

2026-11-06 로컬 `git init -b main`은 실행했지만, 실행 환경의 `.git/config` 쓰기 제한으로 origin 등록은 실패했습니다. GitHub 네트워크 연결도 차단되어 원격 브랜치와 기존 파일을 확인하지 못했습니다. 현재 상태는 **로컬 Git 초기화만 완료, 원격 연결·commit·push 미완료**입니다.

사용자 Git Bash에서 아래 명령으로 origin을 등록하고 원격 상태를 먼저 확인하세요.

```bash
git remote add origin https://github.com/chan2cha/IpJu.git
git ls-remote origin
```

origin이 이미 있다면 `git remote -v`로 URL이 위 저장소와 같은지 확인하세요. 원격에 브랜치가 보이면 아래 최초 업로드 명령을 바로 실행하지 말고 `git fetch origin` 후 기존 파일과 이력을 확인해야 합니다. 강제 push는 사용하지 않습니다.

## 현재 상태

현재 앱은 가상 데이터를 메모리에 저장하는 시제품입니다. Vercel에 올리는 것만으로 Supabase에 저장되지는 않습니다. 로그인·가구별 권한·DB 연동은 별도 구현해야 합니다. 실제 계정이나 금융 데이터는 이 단계에서 입력하지 않습니다.

2026-11-06 로컬에서 `npm run build`의 컴파일, 타입 검사, 전체 페이지 생성을 확인했습니다. 외부 저장소 생성·push·배포와 Supabase 변경은 수행하지 않았습니다.

## 1. GitHub 저장소 연결

원격 저장소가 비어 있는 것을 확인한 경우, 이 프로젝트 폴더에서 Git Bash로 실행합니다. 위 단계에서 Git 초기화와 origin 등록을 마쳤다는 전제입니다.

```bash
git add .
git diff --cached --stat
git commit -m "입주노트 시제품 및 상품 비교 구현"
git push -u origin main
```

커밋 전 `.env.local` 등 실제 키 파일이 포함되지 않았는지 확인합니다. `.env*`, `.vercel/`, `.next/`, `node_modules/`, 테스트 결과는 제외됩니다. `.env.example`과 `package-lock.json`은 포함합니다. `.vscode/settings.json`은 현재 Windows PC의 Git Bash/fnm 경로를 사용하므로 다른 PC에서는 조정할 수 있습니다.

## 2. Vercel 연결

1. Vercel의 **Add New → Project**에서 GitHub 저장소를 Import합니다.
2. Framework Preset은 **Next.js**, Root Directory는 프로젝트 루트로 설정합니다.
3. Node.js는 **22.x**를 선택합니다. 현재 `package.json`은 22.18 이상을 허용합니다. 로컬에서는 Node 26.13.0으로 검증했으며 Vercel의 Node 22 실행 결과는 배포 로그로 별도 확인해야 합니다.
4. `vercel.json`에 따라 `npm ci`로 설치하고 lint → typecheck → test → build 순서로 검사합니다. 실패하면 배포 빌드도 실패합니다.
5. 현재 시제품에는 Supabase 환경변수가 필요하지 않습니다. Deploy하면 가상 데이터 앱이 배포됩니다.

GitHub 연동 후 main 브랜치 변경은 운영 배포로, 다른 브랜치/PR은 Preview 배포로 연결할 수 있습니다. 저장소 연결 권한과 Production Branch를 Vercel에서 확인합니다.

## 3. Supabase 준비

Supabase 프로젝트를 만든 뒤 프로젝트 URL과 Publishable key를 확인합니다. 키는 프로젝트 연결 화면에서 확인할 수 있습니다. 실제 비밀키나 DB 비밀번호는 저장소에 넣지 않습니다.

로그인·DB 구현 시 다음 값을 로컬 `.env.local`과 Vercel의 Environment Variables에 각각 설정할 예정입니다. **현재 코드에서는 아직 사용하지 않습니다.**

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://mtmtjfbarvbhdmiyfqtr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=프로젝트의_publishable_key
```

Publishable key는 공개 클라이언트용이며 데이터 접근은 인증과 RLS로 제한합니다. `service_role`이나 Secret key를 `NEXT_PUBLIC_` 변수로 지정하지 않습니다.

현재 환경에서 Supabase SDK 설치도 npm 네트워크 제한(`EACCES`)으로 실패했습니다. 사용자 Git Bash에서 다음 명령으로 설치할 수 있습니다. 설치만으로 앱의 DB 연동이 완료되지는 않습니다.

```bash
npm install @supabase/ssr @supabase/supabase-js
```

Supabase 계정 연결 후 기존 DB 구조와 인증 설정을 먼저 확인하고 migration을 준비해야 합니다. 현재는 SQL을 원격 DB에 실행하거나 기존 테이블을 변경하지 않았습니다.

실제 연동 구현 범위:

- Next.js 서버 세션 기반 로그인 및 로그아웃.
- household와 구성원, 초대, 할 일, 지출, 결제, 자금, 상품·업체 비교 후보 테이블.
- 같은 household 구성원만 접근할 수 있는 RLS와 서버 인증·인가.
- 가상 데이터 상태를 DB 조회/저장으로 교체하고 새로고침 후 데이터 유지.
- 동일 가구 두 사용자 공유 및 제3자 접근 차단 테스트.
- 로그인 콜백 구현 후 Supabase Auth에 로컬 주소와 실제 Vercel 도메인 등록.

운영 DB 변경은 버전 관리된 SQL migration으로 수행합니다. Preview가 운영 데이터를 수정하지 않도록 별도 개발 Supabase 프로젝트 또는 명확히 분리한 환경을 사용합니다.

## 참고 문서

- [GitHub 저장소를 Vercel에 연결](https://vercel.com/docs/git/vercel-for-github)
- [Vercel Node.js 버전](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Supabase 서버 세션 인증](https://supabase.com/docs/guides/auth/server-side)
