# Dez Dicas

Jogo de adivinhação por dicas, inspirado no formato Perfil Express. React Native + Expo, 100% offline, sem login e sem servidor. A única permissão declarada é `VIBRATE`.

## Como gerar o APK

Você precisa de Node 18+ e uma conta gratuita no Expo.

```bash
npm install
npm install -g eas-cli
eas login
eas build:configure      # confirme o projeto quando perguntar
eas build -p android --profile preview
```

O build roda na nuvem do Expo e leva entre 8 e 15 minutos. No fim, o terminal mostra um link para baixar o `.apk`. Instale no aparelho permitindo "fontes desconhecidas".

Para a Play Store, gere o `.aab`:

```bash
eas build -p android --profile production
```

## Build local, sem conta e sem nuvem

Requer Android Studio com SDK 34 e Java 17 instalados:

```bash
npm install
npx expo prebuild -p android
cd android && ./gradlew assembleRelease
# saída: android/app/build/outputs/apk/release/app-release.apk
```

## Rodar em desenvolvimento

```bash
npm install
npm start
```

Abra com o app Expo Go no celular, ou `npm run android` com um emulador ligado.

## Estrutura

```
App.js                 máquina de estados das telas
src/theme.js           paleta por categoria
src/deck.js            carga e sorteio do baralho
src/useSession.js      sessão persistida em AsyncStorage
src/SetupScreen.js     escolha de categorias da sessão
src/CardScreen.js      a carta, as dez dicas e o rodapé fixo
src/ResultScreen.js    resultado da rodada
src/StatsScreen.js     estatísticas do fim da sessão
deck/*.json            100 cartas, 10 dicas cada
```

## Editar o baralho

Cada arquivo em `deck/` é uma lista simples:

```json
{ "id": "f26", "answer": "Resposta", "clues": ["dica 1", "...", "dica 10"] }
```

Regras: exatamente 10 dicas, `id` único, primeira pessoa, da mais vaga para a mais óbvia. A dica 10 praticamente entrega a resposta. Depois de editar, rode a validação:

```bash
node -e "for (const f of ['pessoa','filme','serie','coisa']) { const d = require('./deck/'+f+'.json'); const bad = d.filter(c => c.clues.length !== 10); console.log(f, d.length, 'cartas', bad.length ? 'PROBLEMA: '+bad.map(c=>c.id) : 'ok'); }"
```

## Decisões de implementação

**Dicas não reveladas usam tarjas, não desfoque.** O React Native não tem filtro de blur para texto no Android sem biblioteca nativa, e as soluções existentes derrubam a taxa de quadros em aparelhos modestos. As tarjas têm largura proporcional a cada palavra, então a linha parece a mesma antes e depois de revelar.

**Altura das faixas fixa.** `rowH` é calculado uma vez a partir da altura da tela e limitado entre 30 e 44 pixels. As dez faixas somam sempre o mesmo, revelado ou não, então o rodapé nunca se move.

**Sessão persistida.** Categorias, cartas já usadas, placar e histórico ficam em `AsyncStorage` sob a chave `@dezdicas/session/v1`. Fechar e reabrir o app retoma a sessão na tela da carta.

**Sorteio sem repetição.** `drawCard` filtra o baralho pelas categorias da sessão e pelos `id` já usados antes de sortear.
