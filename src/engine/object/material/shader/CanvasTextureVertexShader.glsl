#version 300 es

in vec3 vertexPosition;
in vec2 texCoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec2 textureCoord;

void main() {
  textureCoord = texCoord;
  gl_Position = projection * view * model * vec4(vertexPosition, 1.0);
}