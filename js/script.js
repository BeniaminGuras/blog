'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list';

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log(event);
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
    console.log('Klasa acrive usunieta');
  }

  /* add class 'active' to the clicked link */
  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const attribute = clickedElement.getAttribute('href');
  console.log(attribute);

  /* find the correct article using the selector (value of 'href' attribute) */
  const articleTarget = document.querySelector(attribute);
  console.log(articleTarget);

  /* add class 'active' to the correct article */
  articleTarget.classList.add('active');

}

function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  console.log(titleList);
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log('articles: ', articles);
  
  for (let article of articles) {
    console.log('article: ', article);
    const articleId = article.getAttribute('id');
    console.log('articleId: ', articleId);
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    console.log(articleTitle);
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    console.log('abc: ', linkHTML);
    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }

  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

function generateTags() {
  let allTags = [];
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    console.log(tagsWrapper);
    let htmlLink = '';
    const dataTags = article.getAttribute('data-tags');
    const tags = dataTags.split(' ');

    for (let tag of tags) {
      const html = '<li><span><a href="#' + 'tag-' + tag + '">' + tag + '</a></li>';
      console.log(html);
      htmlLink = htmlLink + html;
      console.log('htmlLink: ', htmlLink);
      if(allTags.indexOf(html) == -1){
        /* [NEW] add generated code to allTags array */
        allTags.push(html);
      }
    }
    tagsWrapper.insertAdjacentHTML('beforeend', htmlLink);
  }
  const tagList = document.querySelector(optTagsListSelector);
  tagList.innerHTML = allTags.join(' ');
}

function tagClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log(clickedElement);
  const href = clickedElement.getAttribute('href');
  console.log('href', href);
  const tag = href.replace('#tag-', '');
  console.log('tag', tag);
  /* find all tag links with class active */
  const activeTagsLink = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let activeTagLink of activeTagsLink){
    activeTagLink.classList.remove('active');
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const equalHrefs = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let equalHref of equalHrefs){
    equalHref.classList.add('active');
  }
  /* END LOOP: for each found tag link */

  generateTitleLinks('[data-tags~="' + tag + '"]');

}

function addClickListenersToTags() {

  /* find all links to tags */

  const tagsLinks = document.querySelectorAll('.post-tags .list li span a');

  /* START LOOP: for each link */

  for (let tagLink of tagsLinks) {

    /* add tagClickHandler as event listener for that link */

    tagLink.addEventListener('click', tagClickHandler);

    /* END LOOP: for each link */

  }

}

function generateAuthorLinks(){
  const articles = document.querySelectorAll(optArticleSelector);
  for(let article of articles){
    const authorWrap = article.querySelector(optAuthorSelector);
    console.log('authorWrap', authorWrap);
    let htmlLink = 'by ';
    const author = article.getAttribute('data-author');
    const html = '<a href="#' + author + '">' + author + '</a>';
    console.log('html', html);
    htmlLink = htmlLink + html; 
    console.log('htmlLinkS', htmlLink);
    authorWrap.insertAdjacentHTML('beforeend', htmlLink);
  }
  
}

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('klikniecie w element', clickedElement);
  const authorHref = clickedElement.getAttribute('href');
  const author = authorHref.replace('#', '');
  console.log('authorHref', author);
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  const authorLinks = document.querySelectorAll('.post-author a' );
  for(let authorLink of authorLinks){
    authorLink.addEventListener('click', authorClickHandler);
  }
}

generateTitleLinks();
generateTags();
addClickListenersToTags();
generateAuthorLinks();
addClickListenersToAuthors();

