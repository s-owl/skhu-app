# SKHU's - Mobile App Client

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/af9e32c1e5cf43ed9b904e70c33d3714)](https://app.codacy.com/app/s-owl/skhu-app?utm_source=github.com&utm_medium=referral&utm_content=s-owl/skhu-app&utm_campaign=Badge_Grade_Settings)

성공회대학교의 종합정보시스템과, 학내 소식을 모바일 환경에서 쉽게 받아볼 수 있게 해주는 앱, SKHU's 의 모바일 앱 소스코드 저장소 입니다.
기존 Foressst 앱의 리뉴얼 버전입니다. React Native 와 Expo 를 사용하여 개발되었습니다.

## 개발자/기여자(Developers/Contributors)
### 현재(Current)
- 한나라(201633036, nr970810@gmail.com)
    - 기획, 앱 화면 설계 및 개발, 총괄(2018.03~)
- 조준서(201635039, coogys@naver.com)
    - 백엔드 개발, 앱 개발(2018.09 ~ )'
- 김남수(201435003, are34@naver.com)
    - 백엔드 개발,앱 개발(2018.10 ~ )'

### 이전(Former)
- 한영빈(201632034, sukso96100@gmail.com)
    - 앱 개발, 백엔드 개발, 서버 관리, 프로젝트 총괄(2016.08 ~ 2018.09)
- 김유진(201732008, yujin7621@me.com)
    - 앱 개발(2018.03 ~ 2018.08)
- 추건우(201534028, geonwoo.chu@gmail.com)
    - 앱 및 백엔드 개발(2016.08 ~ 2018.03)
- 배다슬(201232016, ektmf1993@gmail.com)
    - 앱 개발 및 총괄(2016.08 ~ 2017.06)

## 의존성(Dependencies)
`package.json` 참고

## 개발환경 구축 및 테스트

- [Node.js 를 먼저 사전에 설치](https://nodejs.org/en/download/)
- Yarn, Expo CLI 설치
    - `npm install -g yarn expo-cli`
- 프로젝트 디렉토리에 접근하여 의존성 설치
    - `yarn install`
- iOS 에서 테스트 하려면 [Xcode](https://itunes.apple.com/app/xcode/id497799835) 를, Android 에서 테스트 하려면 [Android Studio](https://developer.android.com/studio/)를 설치할 것.
- `expo start` 명령을 실행하여, Expo 개발자 도구 실행. 웹 브라우저 새 탭에서 켜짐.
  `npm start` 명령을 실행하면 console 창에서 실행
    - Android 기기나 에뮬레이터로 실행해 보려면, *Run on Android device/emulator* 클릭
    - iOS 시뮬레이터로 실행해 보려면, *Run on iOS simulator* 클릭
    - 프로덕션 환경으로 테스트 하려면, *PRODUCTION MODE* 를 켜면 됨.
        - 앱이 프로덕션 모드에서는 실제 서버와, 프로덕션 모드 꺼졌을 떄는 로컬에서 돌아가는 서버와 통신함.

## 앱 빌드
- Expo CLI 에서 로그인
    - `expo login`
- Android 용 빌드
    - `expo build:android`
- iOS 용 빌드
    - `expo build:ios`
- iOS 시뮬레이터용 빌드
    - `expo build:ios -t simulator`

# 저작권 안내(Copyrights Notice)
본 소프트웨어는 자유 소프트웨어 또는 오픈소스 소프트웨어가 아닙니다. 본 소프트웨어의 저작권은 프로젝트 개발자와 기여자 분들꼐 있습니다. 본 프로젝트의 소스코드가 GitHub 에 공개 되어 있는 것은, 개발자와 기여자 분들께서 본 프로젝트를 포트폴리오로 활용하실 수 있도록 하게 하기 위함입니다. 소스코드가 공개 되어 있으므로 이를 자유롭게 열람하는 것은 문제가 없습니다. 그러나 프로젝트의 저작물 일부를 본인의 저작물에 사용하고자 하거나, 본 프로젝트를 기반으로 2차 저작물을 생산하여 배포 하고자 하는 경우 본 프로젝트의 개발자 및 기여자와의 사전 협의가 필요합니다.

This software IS NOT A FREE SOFTWARE OR OPEN SOURCE SOFTWARE. All copyrights are reserved to developers and contributors of this project. The reason why source code of the project is public on GitHub is to let our developers and contributors to use this project on their portfolio. You can browse the source code freely since it's public on GitHub. But if you want to use some part of our works on your works or you want to produce and redistribute your own derivative work based on this project, You have to discuss it with developers and contributors of this project before doing that.
