# 중앙도서관 야간버스 안내 웹앱

중앙도서관 야간버스의 운영일, 출발 시간, 노선, 정류장 순서를 모바일 우선 UI로 확인할 수 있는 React/Vite 웹앱입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:5173
```

## 같은 Wi-Fi의 휴대폰에서 확인

```bash
npm run dev -- --host 0.0.0.0
```

PC/Mac의 내부 IP를 확인한 뒤, 휴대폰 브라우저에서 아래처럼 접속합니다.

```text
http://내부IP주소:5173
```

예:

```text
http://192.168.0.15:5173
```


## GitHub Pages로 바로 공개하기

이 프로젝트는 GitHub Pages 배포용 설정을 포함합니다.

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더 안의 모든 파일과 폴더를 저장소에 업로드합니다.
   - 특히 `.github/workflows/deploy.yml` 파일도 함께 올라가야 합니다.
3. 저장소에서 **Settings > Pages**로 이동합니다.
4. **Build and deployment > Source**를 **GitHub Actions**로 선택합니다.
5. 저장소의 **Actions** 탭에서 배포가 끝날 때까지 기다립니다.
6. 다시 **Settings > Pages**로 가면 공개 주소가 표시됩니다.

공개 주소는 보통 아래 형태입니다.

```text
https://깃허브아이디.github.io/저장소이름/
```

예:

```text
https://sangjun.github.io/library-night-bus/
```


## Vercel 배포

1. 이 폴더를 GitHub 저장소에 업로드합니다.
2. Vercel에서 **Add New Project**를 선택합니다.
3. 해당 GitHub 저장소를 선택합니다.
4. Framework Preset은 **Vite**로 둡니다.
5. Build Command는 `npm run build`, Output Directory는 `dist`입니다.
6. Deploy를 누르면 공개 URL이 생성됩니다.

## Netlify 배포

1. 이 폴더를 GitHub 저장소에 업로드합니다.
2. Netlify에서 **Add new site > Import an existing project**를 선택합니다.
3. Build Command는 `npm run build`, Publish directory는 `dist`입니다.
4. Deploy를 누르면 공개 URL이 생성됩니다.

## 데이터 수정 위치

버스 노선은 `src/App.jsx`의 `routes` 객체에서 수정합니다.

운행일과 시간은 `src/App.jsx`의 아래 부분에서 수정합니다.

```js
const compactDays = [10, 11, 12, 13, 14, 25, 26, 27];
const fullDays = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
```
