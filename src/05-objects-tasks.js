/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.create(proto, Object.getOwnPropertyDescriptors(JSON.parse(json)));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  itemsCollection: [],
  order: 0,
  value: '',
  countError: new Error('Element, id and pseudo-element should not occur more then one time inside the selector'),
  orderError: new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'),

  checkOrder(order) {
    if (this.order > order) throw this.orderError;
  },
  stringify() {
    return this.value;
  },

  element(value) {
    const item = Object.create(cssSelectorBuilder);
    Object.assign(item, this);
    if (this.itemsCollection.includes('element')) throw this.countError;
    item.order = 1;
    this.checkOrder(1);
    item.itemsCollection = [...this.itemsCollection, 'element'];
    item.value += value;
    return item;
  },

  id(value) {
    const item = Object.create(cssSelectorBuilder);
    Object.assign(item, this);
    if (this.itemsCollection.includes('id')) throw this.countError;
    item.order = 2;
    this.checkOrder(2);
    item.itemsCollection = [...this.itemsCollection, 'id'];
    item.value += `#${value}`;
    return item;
  },

  class(value) {
    const item = Object.create(cssSelectorBuilder);
    Object.assign(item, this);
    item.order = 3;
    this.checkOrder(3);

    item.itemsCollection = [...this.itemsCollection, 'class'];
    item.value += `.${value}`;
    return item;
  },

  attr(value) {
    const item = Object.create(cssSelectorBuilder);
    Object.assign(item, this);
    item.order = 4;
    this.checkOrder(4);

    item.itemsCollection = [...this.itemsCollection, 'attr'];
    item.value += `[${value}]`;
    return item;
  },

  pseudoClass(value) {
    const item = Object.create(cssSelectorBuilder);
    Object.assign(item, this);
    item.order = 5;
    this.checkOrder(5);

    item.itemsCollection = [...this.itemsCollection, 'pseudoClass'];
    item.value += `:${value}`;
    return item;
  },

  pseudoElement(value) {
    const item = Object.create(cssSelectorBuilder);
    Object.assign(item, this);
    if (this.itemsCollection.includes('pseudoElement')) throw this.countError;
    item.order = 6;
    this.checkOrder(6);
    item.itemsCollection = [...this.itemsCollection, 'pseudoElement'];
    item.value += `::${value}`;
    return item;
  },

  combine(selector1, combinator, selector2) {
    const item = Object.create(cssSelectorBuilder);
    Object.assign(item, this);

    item.value = `${this.value}${selector1.value} ${combinator} ${selector2.value}`;
    return item;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
