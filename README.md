# OYLAB

Қазақ тіліндегі интерактивті ML зертханасы.

**Публичный сайт: [Открыть OYLAB](https://oylab-ml-journey.kiregami.chatgpt.site)**

- [Decision Tree — выращивание дерева](https://oylab-ml-journey.kiregami.chatgpt.site/decision-tree/)
- [Random Forest — урок, затем лаборатория ансамбля](https://oylab-ml-journey.kiregami.chatgpt.site/random-forest/)
- [Gradient Boosting — урок, затем студия корректировок](https://oylab-ml-journey.kiregami.chatgpt.site/gradient-boosting/)
- [XGBoost — дополнительный урок и лаборатория регуляризации](https://oylab-ml-journey.kiregami.chatgpt.site/xgboost/)

Из урока Gradient Boosting на XGBoost ведёт кликабельный блок. Дополнительная страница объясняет различия, градиенты и гессианы, веса листьев и Gain. Интерактивный пример пересчитывает регуляризованные деревья глубины 1 при изменении λ, γ и learning rate. Это учебная реализация основных формул, а не запуск библиотеки XGBoost.

На страницах Random Forest и Gradient Boosting сначала показаны все объяснения и проверка знаний, затем интерактивные графики. Лаборатории не закрепляются при прокрутке. В Decision Tree добавлен пример дерева событий мультивселенной с двумя выборами и четырьмя исходами; это заранее заданная учебная история, отличная от обучения модели по данным.

Кадр дерева времени из «Loki», сезон 2 (2023): © Marvel Studios. Использован предоставленный пользователем скриншот `Screenshot 2026-10-28 111902.png` (1919 × 1079), сохранённый без изменений и сжатия в `dist/assets/loki-multiverse-screenshot.png`. Визуальная идея дерева времени описана создателями эффектов: [Framestore](https://www.framestore.com/work/loki-season-2).

Static HTML / CSS / ES modules. No production dependencies or backend. Serve `dist/` using any static server. Routes: `/`, `/decision-tree/`, `/random-forest/`, `/gradient-boosting/`, `/xgboost/`.

Run `npm test` to check the original model math and second-order regularized boosting formulas (`node tests.mjs` and `node xgboost-model.test.mjs`). `python -m http.server 8080 --directory dist` starts local preview.

Models are small real educational implementations: binary CART with Gini, bootstrap random forest with one random feature per split, and residual gradient boosting with squared error and depth-two regression trees. Fixed, separate synthetic train and test/validation datasets. User-added classification data and learning settings persist in browser localStorage. Forest ties select class A.

Content draws on the supplied lecture's Decision Tree slides and the scikit-learn ensemble user guide: https://scikit-learn.org/stable/modules/ensemble.html . The supplied slide text contains little Random Forest or Gradient Boosting material; these sections were independently developed.

Lesson route index files share the application shell and load shared modules. The XGBoost route has its own initial title; preserve it when copying changes from `dist/index.html`.
