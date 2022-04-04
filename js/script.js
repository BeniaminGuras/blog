'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagArticleLink: Handlebars.compile(document.querySelector('#tag-article-link').innerHTML),
  authorArticleLink: Handlebars.compile(document.querySelector('#author-article-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#tag-cloud-link').innerHTML),
  authorSidebar: Handlebars.compile(document.querySelector('#author-side-bar').innerHTML),
}

const opts = {
  optArticleSelector: '.post',
  optTitleSelector: '.post-title',
  optTitleListSelector:  '.titles',
  optArticleTagsSelector: '.post-tags .list',
  optAuthorSelector: '.post-author',
  optTagsListSelector: '.tags.list',
  optCloudClassCount: 5,
  optCloudClassPrefix: 'tag-size',
  optAuthorsListSelector: '.list.authors',
};

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
  const titleList = document.querySelector(opts.optTitleListSelector);
  console.log(titleList);
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(opts.optArticleSelector + customSelector);
  console.log('articles: ', articles);
  
  for (let article of articles) {
    console.log('article: ', article);
    const articleId = article.getAttribute('id');
    console.log('articleId: ', articleId);
    const articleTitle = article.querySelector(opts.optTitleSelector).innerHTML;
    console.log(articleTitle);
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log('abc: ', linkHTML);
    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }

  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

function calculateTagsParams(tags){
  const minMax = {
    lowest: 99999,
    heights: 0,
  };
  for(let tag in tags){
    console.log('moim tagiem jest', tags[tag]);
    if(tags[tag] < minMax.lowest){
      minMax.lowest = tags[tag]; 
    }

    if(tags[tag] > minMax.heights){
      minMax.heights = tags[tag]; 
    }
  }
  console.log('min i max', minMax);
  return minMax;
}

function calculateTagClass(count, params){
  console.log('count', count);
  console.log('params', params);

  const normalizedCount = count - params.lowest;
  const normalizedMax = params.heights - params.lowest;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.optCloudClassCount - 1) + 1 );
  console.log('classNumber', classNumber);
  return opts.optCloudClassPrefix + '-' + classNumber; 
}

function generateTags() {
  let allTags = {};
  const articles = document.querySelectorAll(opts.optArticleSelector);
  for (let article of articles) {
    const tagsWrapper = article.querySelector(opts.optArticleTagsSelector);
    console.log(tagsWrapper);
    const dataTags = article.getAttribute('data-tags');
    const tags = dataTags.split(' ');
    const html = {};
    let htmlLink = '';
    for (let tag of tags) {
      html.id = 'tag-' + tag; 
      html.title = tag;
      htmlLink = templates.tagArticleLink(html);
      tagsWrapper.insertAdjacentHTML('beforeend', htmlLink);
      if(!allTags.hasOwnProperty(tag)){
        allTags[tag] = 1; 
      } else {
        allTags[tag]++;
      }
    }
  }
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams', tagsParams);
  const allTagsData = {tags: []};
  for(let tag in allTags){
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams),
    });
  }
  const tagList = document.querySelector(opts.optTagsListSelector);
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log('allTagsData', allTagsData);
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
  const articles = document.querySelectorAll(opts.optArticleSelector);
  const allAuthors = {};
  let authorHTML = {authors: []};
  for(let article of articles){
    const authorWrap = article.querySelector(opts.optAuthorSelector);
    console.log('authorWrap', authorWrap);
    let htmlLink = '';
    const author = article.getAttribute('data-author');
    const html = {id: author, title: 'by ' + author};
    console.log('html', html);
    htmlLink = templates.authorArticleLink(html);
    console.log('htmlLinkS', htmlLink);
    authorWrap.insertAdjacentHTML('beforeend', htmlLink);
    if(!allAuthors.hasOwnProperty(author)){
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++; 
    }
    console.log('author', allAuthors);
    
  }

  for(let author in allAuthors){
    authorHTML.authors.push({
      author: author,
      articles: allAuthors[author],
    })
  };
  document.querySelector(opts.optAuthorsListSelector).innerHTML = templates.authorSidebar(authorHTML);
  console.log('to chce wiedziec', authorHTML);
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

