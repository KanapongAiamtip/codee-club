import keyBy from 'lodash/keyBy'

import { New, Problem } from '@codee-club/common/dist/dao'
import { ActivityStatus, TestVisibility } from '@codee-club/common/dist/data-types/enums'

import getGuid from '~/get-guid'
import { ActivityAndProblems } from '../types/activity-types'

// Test visibility
const VISIBLE = TestVisibility.Visible
const HIDDEN = TestVisibility.Hidden

const problems: Array<New<Problem>> = [
  {
    seq: 1,
    name: 'Group 1',
    description: '<div class="content">\n<p>A <code>Cone</code> is a 3D shape with a <code>radius</code> (r) and a <code>height</code> (h).</p>\n<svg width="200" height="200" version="1.1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><metadata><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title/></cc:Work></rdf:RDF></metadata><g fill-opacity="0" stroke-dasharray="0"><path d="m160 140a60 30 0 00-120 0h60z" stroke="#bbb" stroke-opacity="0" stroke-width="2"/><path d="m160 140a60 30 0 00-120 0" stroke="#bbb" stroke-width="2px"/><path d="m40 140a60 30 0 00120 0h-60z" stroke="#000" stroke-opacity="0" stroke-width="2"/><path d="m40 140a60 30 0 00120 0" stroke="#000" stroke-width="2px"/></g><g stroke="#000"><g stroke-width="2px"><path d="m160 140-60-120" fill="none"/><path d="m40 140 60-120" fill="none"/><ellipse cx="100" cy="140" rx="2" ry="2" stroke-dasharray="0"/></g><path d="m100 20v120h-60" fill="none" stroke-dasharray="4.50141728,1.50047243" stroke-width="1.5005"/></g><text x="107.81378" y="95.951591" font-family="serif" font-size="13.333px" font-style="italic" text-align="center" text-anchor="middle" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;line-height:1.25" xml:space="preserve"><tspan x="107.81378" y="95.951591">h</tspan></text><text x="62.698132" y="150.80443" font-family="serif" font-size="13.333px" font-style="italic" text-align="center" text-anchor="middle" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;line-height:1.25" xml:space="preserve"><tspan x="62.698132" y="150.80443">r</tspan></text></svg>\n<p>The volume of a cone is calculated by <code>&#960; &times; r&sup2; &times; h / 3</code>. In Java, use <code>Math.PI</code> to get the value of &#960;.</p>\n<p>Complete the class <code>Cone</code> by adding a <strong>constructor</strong> and <strong>methods</strong> for getting radius, height and volume.</p>\n</div>\n<pre>\nclass Cone {\n    private double radius;\n    private double height;\n    \n    // TODO Constructor and methods\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Cone x = new Cone(sc.nextDouble(), sc.nextDouble());\n        System.out.println("Cone with radius " + x.getRadius() \n            + " and height " + x.getHeight() + " has a volume of " \n            + String.format("%.2f", x.getVolume()) + ".");\n    }\n}\n</pre>',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '2.5\n6',
          expected: 'Cone with radius 2.5 and height 6.0 has a volume of 39.27.',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: '2.35\n5.75',
          expected: 'Cone with radius 2.35 and height 5.75 has a volume of 33.25.',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: '1.5\n8.9',
          expected: 'Cone with radius 1.5 and height 8.9 has a volume of 20.97.',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: '4.4\n8.8',
          expected: 'Cone with radius 4.4 and height 8.8 has a volume of 178.41.',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: '1.234\n3.456',
          expected: 'Cone with radius 1.234 and height 3.456 has a volume of 5.51.',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 2,
    name: 'Group 2',
    description: '<div class="content">\n<p>A <code>Cylinder</code> is a 3D shape with a <code>diameter</code> (d) and a <code>height</code> (h).</p>\n<svg width="200" height="200" version="1.1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><metadata><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title/></cc:Work></rdf:RDF></metadata><g fill-opacity="0" stroke-dasharray="0"><path d="m160 160a60 30 0 00-120 0h60z" stroke="#bbb" stroke-opacity="0" stroke-width="2"/><path d="m160 160a60 30 0 00-120 0" stroke="#bbb" stroke-width="2px"/><g stroke="#000"><path d="m40 160a60 30 0 00120 0h-60z" stroke-opacity="0" stroke-width="2"/><path d="m40 160a60 30 0 00120 0" stroke-width="2px"/><ellipse cx="100" cy="40" rx="60" ry="30" stroke-width="2px"/></g></g><g fill="none" stroke="#000"><path d="m160 160v-120" stroke-width="2px"/><path d="m40 160v-120" stroke-width="2px"/><path d="m160 40h-120" stroke-dasharray="6.36396, 2.12132" stroke-width="2.1213px"/></g><text x="168.77312" y="101.83941" font-family="serif" font-size="13.333px" font-style="italic" text-align="center" text-anchor="middle" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;line-height:1.25" xml:space="preserve"><tspan x="168.77312" y="101.83941">h</tspan></text><text x="98.139977" y="34.550774" font-family="serif" font-size="13.333px" font-style="italic" text-align="center" text-anchor="middle" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;line-height:1.25" xml:space="preserve"><tspan x="98.139977" y="34.550774">d</tspan></text></svg>\n<p>The volume of a cylinder is calculated by <code>&#960; &times; (d/2)&sup2; &times; h</code>. In Java, use <code>Math.PI</code> to get the value of &#960;.</p>\n<p>Complete the class <code>Cylinder</code> by adding a <strong>constructor</strong> and <strong>methods</strong> for getting diameter, height and volume.</p>\n</div>\n<pre>\nclass Cylinder {\n    private double diameter;\n    private double height;\n    \n    // TODO Constructor and methods\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Cylinder x = new Cylinder(sc.nextDouble(), sc.nextDouble());\n        System.out.println("Cylinder with diameter " + x.getDiameter() \n            + " and height " + x.getHeight() + " has a volume of " \n            + String.format("%.2f", x.getVolume()) + ".");\n    }\n}\n</pre>',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '2.5\n5',
          expected: 'Cylinder with diameter 2.5 and height 5.0 has a volume of 24.54.',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: '4.5\n6.8',
          expected: 'Cylinder with diameter 4.5 and height 6.8 has a volume of 108.15.',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: '4\n6',
          expected: 'Cylinder with diameter 4.0 and height 6.0 has a volume of 75.40.',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: '1.25\n2.67',
          expected: 'Cylinder with diameter 1.25 and height 2.67 has a volume of 3.28.',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: '8.9\n4.44',
          expected: 'Cylinder with diameter 8.9 and height 4.44 has a volume of 276.22.',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 3,
    name: 'Group 3',
    description: '<div class="content">\n<p>A <code>Pyramid</code> is a 3D shape with a <code>width</code> (w) and a <code>height</code> (h).</p>\n<?xml version="1.0" encoding="UTF-8"?>\n<svg width="200" height="166.67" version="1.1" viewBox="0 0 200 166.67" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><metadata><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title/></cc:Work></rdf:RDF></metadata><g fill="none" stroke-width="2px"><path d="m16.667 133.33h116.67l50-50-83.333-75-83.333 125h116.67l-33.333-125" stroke="#000"/><path d="m16.667 133.33 50-50h116.67-116.67l33.333-75" stroke="#aaa"/><path d="m100 8.3333v100" stroke="#000" stroke-dasharray="6,2"/></g><ellipse cx="100" cy="108.33" rx="1.6667" ry="1.6667" stroke="#000" stroke-dasharray="0" stroke-width="2px"/><text x="93.249847" y="66.624016" font-family="serif" font-size="13.333px" font-style="italic" text-align="center" text-anchor="middle" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;line-height:1.25" xml:space="preserve"><tspan x="93.249847" y="66.624016">h</tspan></text><text x="73.696777" y="145.45705" font-family="serif" font-size="13.333px" font-style="italic" text-align="center" text-anchor="middle" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;line-height:1.25" xml:space="preserve"><tspan x="73.696777" y="145.45705">w</tspan></text></svg>\n<p>The volume of a pyramid is calculated by <code>w&sup2; &times; h / 3</code>.</p>\n<p>Complete the class <code>Pyramid</code> by adding a <strong>constructor</strong> and <strong>methods</strong> for getting width, height and volume.</p>\n</div>\n<pre>\nclass Pyramid {\n    private double width;\n    private double height;\n    \n    // TODO Constructor and methods\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Pyramid x = new Pyramid(sc.nextDouble(), sc.nextDouble());\n        System.out.println("Pyramid with width " + x.getWidth() \n            + " and height " + x.getHeight() + " has a volume of " \n            + String.format("%.2f", x.getVolume()) + ".");\n    }\n}\n</pre>',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '4.5\n8.0',
          expected: 'Pyramid with width 4.5 and height 8.0 has a volume of 54.00.',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: '2.125\n6.5',
          expected: 'Pyramid with width 2.125 and height 6.5 has a volume of 9.78.',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: '3.33\n6.66',
          expected: 'Pyramid with width 3.33 and height 6.66 has a volume of 24.62.',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: '5.55\n6.78',
          expected: 'Pyramid with width 5.55 and height 6.78 has a volume of 69.61.',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: '3.2\n5',
          expected: 'Pyramid with width 3.2 and height 5.0 has a volume of 17.07.',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  }
]

export const activityAndProblems: ActivityAndProblems = {
  activity: {
    seq: 5,
    name: 'Midterm Exam Part 4',
    status: ActivityStatus.Published,
    sectionIds: [],
    deadlines: {}
  },
  problems: problems,
  deadline: '2021-01-13T06:30:00Z'
}
