(() => {
  const REGEX = /https:\/\/github\.com\/(.*)\/(.*)\/issues\/(.*)/;
  const previousContainer = document.getElementById('emojissue');

  if (!REGEX.test(document.location.href)) {
    if (previousContainer) {
      previousContainer.remove();
    }

    return;
  }

  if (previousContainer && REGEX.test(document.location.href)) {
    return;
  }

  // Positive Emojis
  const positiveEmojis = ['heart', '+1', 'tada'];

  // Find most reacted comments
  const comments = document.querySelectorAll('.comment');
  const mostReactedComments = [];

  comments.forEach((comment, index) => {
    if (index === 0) {
      return;
    }

    const reactions = comment.querySelectorAll('.comment-reactions-options g-emoji');

    if (reactions.length) {
      const score = Array.from(reactions).reduce((prev, cur) => {
        const alias = cur.getAttribute('alias');

        if (positiveEmojis.indexOf(alias) !== -1) {
          return prev + parseInt(cur.nextSibling.textContent.trim(), 10);
        }

        return prev;
      }, 0);

      if (score > 0) {
        mostReactedComments.push({ id: comment.id, score });
      }
    }
  });

  if (!mostReactedComments.length) {
    return;
  }

  const generateHTML = args => `
    <span class="emoji">🤘</span> See #${args.currentIndex + 1}
    <span class="reacts">+${args.topFive[args.currentIndex].score} Reacts</span>
  `;

  const topFive = mostReactedComments.sort((a, b) => b.score - a.score).slice(0, 5);
  let currentIndex = 0;

  const button = document.createElement('button');
  button.innerHTML = generateHTML({ topFive, currentIndex });
  button.setAttribute('title', 'Click to see the most positive reacted issue comments.');
  button.classList.add('emojissue');
  button.addEventListener('click', () => {
    document.location.href = `#${topFive[currentIndex].id}`;

    if (currentIndex < topFive.length - 1) {
      currentIndex += 1;
      button.innerHTML = generateHTML({ topFive, currentIndex });
      return;
    }

    currentIndex = 0;
    button.innerHTML = '🤘 Go Back to #1';
  });

  const container = document.createElement('div');
  container.id = 'emojissue';
  container.classList.add('emojissueContainer');
  container.appendChild(button);

  document.body.appendChild(container);
})();
