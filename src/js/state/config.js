export default {
	"roomSize": {
		"roomHeight": 270,
		"roomSizeX": 400,
		"roomSizeY": 300,
		"wallThickness": 10,
		"ratio": 0.01,
	},
	"textures": {
		"wallsOutside": {
			"title": "Стены снаружи",
			"roomValue": "coverUrlOutside",
			"items": [
				{
					"text": "Бетонная штукатурка",
					"value": "/textures/outside/1.jpg",
					"default": true,
				},
				{
					"text": "Кирпичная кладка",
					"value": "/textures/outside/2.jpg",
				},
				{
					"text": "Беленая вагонка",
					"value": "/textures/outside/3.jpg",
				}
			]
		},
		"wallsInside": {
			"title": "Стены внутри",
			"roomValue": "coverUrlInside",
			"items": [
				{
					"text": "Зеленый",
					"value": "/textures/inside/6.jpg",
					"default": true,
				},
				{
					"text": "Голубой",
					"value": "/textures/inside/9.jpg",
				},
				{
					"text": "Красный",
					"value": "/textures/inside/7.jpg",
				},
				{
					"text": "Советский",
					"value": "/textures/inside/8.jpg",
				}
			]
		},
		"floors": {
			"title": "Пол/потолок",
			"roomValue": "coverUrlFloor",
			"items": [
				{
					"text": "Линолеум",
					"value": "/textures/floor/3.jpg",
				},
				{
					"text": "Ковролин",
					"value": "/textures/floor/1.jpg",
				},
				{
					"text": "Паркет",
					"value": "/textures/floor/2.jpg",
					"default": true,
				},
				{
					"text": "Ламинат",
					"value": "/textures/floor/4.jpg",
				}
			]
		}
	},
	"wallParams": {
		"wallParamsHeight": {
			"title": "Высота",
			"roomValue": "roomHeight"
		},
		"wallParamsThick": {
			"title": "Толщина",
			"roomValue": "wallThickness"
		},
	},
	"cutoutParams": {
		"cutoutName": {
			"title": "Название",
			"defaultValue": "Вырез"
		},
		"cutoutWidth": {
			"title": "Ширина",
			"defaultValue": 50
		},
		"cutoutHeight": {
			"title": "Высота",
			"defaultValue": 50
		},
		"cutoutLeft": {
			"title": "Слева",
			"defaultValue": 50
		},
		"cutoutTop": {
			"title": "Сверху",
			"defaultValue": 50
		},
		"cutoutDepth": {
			"title": "Глубина",
			"defaultValue": 10
		},
	},
}
