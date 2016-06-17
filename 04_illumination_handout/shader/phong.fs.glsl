/**
 * a phong shader implementation
 * Created by Samuel Gratzl on 29.02.2016.
 */
precision mediump float;

/**
 * definition of a material structure containing common properties
 */
struct Material {
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	vec4 emission;
	float shininess;
};

/**
 * definition of the light properties related to material properties
 */
struct Light {
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
};

//TASK 2-1 use uniform for material
uniform Material u_material;
// Material material = Material(vec4(0.24725, 0.1995, 0.0745, 1.),
// 														vec4(0.75164, 0.60648, 0.22648, 1.),
// 														vec4(0.628281, 0.555802, 0.366065, 1.),
// 														vec4(0., 0., 0., 0.),
// 														0.4);

//TASK 3-1 use uniform for light
uniform Light u_light;
uniform Light u_light2;
// Light light = Light(vec4(0., 0., 0., 1.),
// 										vec4(1., 1., 1., 1.),
// 										vec4(1., 1., 1., 1.));
//TASK 5-5 use uniform for 2nd light

//varying vectors for light computation
varying vec3 v_normalVec;
varying vec3 v_eyeVec;
varying vec3 v_lightVec;
varying vec3 v_light2Vec;

vec4 calculateSimplePointLight(Light light, Material material, vec3 lightVec,
																vec3 normalVec, vec3 eyeVec) {
	lightVec = normalize(lightVec);
	normalVec = normalize(normalVec);
	eyeVec = normalize(eyeVec);

	//TASK 1-1 implement phong shader
	//compute diffuse term
	float diffuse = max(dot(lightVec, normalVec), 0.0);

	//compute specular term
	vec3 reflectVec = reflect(-lightVec,normalVec);
	float spec = pow(max(dot(reflectVec, eyeVec), 0.0) , material.shininess);

	//use term an light to compute the components
	vec4 c_amb  = clamp(light.ambient * material.ambient, 0.0, 1.0);
	vec4 c_diff = clamp(diffuse * light.diffuse * material.diffuse, 0.0, 1.0);
	vec4 c_spec = clamp(spec * light.specular * material.specular, 0.0, 1.0);
	vec4 c_em   = material.emission;

	return c_amb + c_diff + c_spec + c_em;
}

void main() {
	//TASK 2-3 use material uniform
	//TASK 3-2 use light uniform
	//TASK 5-6 use second light source
	gl_FragColor = calculateSimplePointLight(u_light, u_material, v_lightVec, v_normalVec, v_eyeVec) +
								 calculateSimplePointLight(u_light2, u_material, v_light2Vec, v_normalVec, v_eyeVec);

}
