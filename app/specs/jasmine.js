import Jasmine from 'jasmine'

var jasmine = new Jasmine()
jasmine.loadConfigFile('./specs/jasmine.conf.json')
jasmine.execute()
