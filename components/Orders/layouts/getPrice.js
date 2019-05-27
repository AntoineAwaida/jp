export default function getPrice(articles) {
  let total_price = 0;
  articles.map(article => {
    total_price += article.quantity * article.PrixUnitaire;
  });
  return total_price;
}
