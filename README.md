# OYLAB

Қазақ тіліндегі интерактивті ML зертханасы.

Static HTML / CSS / ES modules. No production dependencies or backend. Serve `dist/` using any static server. Routes: `/`, `/decision-tree/`, `/random-forest/`, `/gradient-boosting/`.

Run `node tests.mjs` to check model math. `python -m http.server 8080 --directory dist` starts local preview.

Models are small real educational implementations: binary CART with Gini, bootstrap random forest with one random feature per split, and residual gradient boosting with squared error and depth-two regression trees. Fixed, separate synthetic train and test/validation datasets. User-added classification data and learning settings persist in browser localStorage. Forest ties select class A.

Content draws on the supplied lecture's Decision Tree slides and the scikit-learn ensemble user guide: https://scikit-learn.org/stable/modules/ensemble.html . The supplied slide text contains little Random Forest or Gradient Boosting material; these sections were independently developed.

The three route index files share source markup and load shared modules. To update markup, copy `dist/index.html` to each route directory after editing.
